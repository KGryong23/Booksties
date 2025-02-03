'use client'

import { useAuctionStore } from '@/hooks/useAuctionStore'
import { useBidStore } from '@/hooks/useBidStore'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { useParams } from 'next/navigation'
import { ReactNode, useCallback, useEffect, useRef } from 'react'

type Props = {
    children: ReactNode
}

export default function SignalRProvider({ children }: Props) {
    const connection = useRef<HubConnection | null>(null);
    const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice);
    const addBid = useBidStore(state => state.addBid);
    const params = useParams<{slug: string}>();
    const handleBidPlaced = useCallback((bid: IBid) => {
        if (bid.status.includes('Accepted')) {
            setCurrentPrice(bid.auctionId, bid.amount);
        }
        if (params.slug === bid.auctionId) {
            addBid(bid);
        }
    }, [setCurrentPrice, addBid, params.slug])

    useEffect(() => {
        if (!connection.current) {
            connection.current = new HubConnectionBuilder()
                .withUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications`)
                .withAutomaticReconnect()
                .build();

            connection.current.start()
                .then(() => 'Connected to notification hub')
                .catch(err => console.log(err));
        }

        connection.current.on('BidPlaced', handleBidPlaced);

        return () => {
            connection.current?.off('BidPlaced', handleBidPlaced);
        }

    }, [setCurrentPrice, handleBidPlaced])

    return (
        children
    )
}
