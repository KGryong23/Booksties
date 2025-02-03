import { create } from "zustand"

type State = {
    auctions: IAuction[]
    totalCount: number
    pageCount: number
}

type Actions = {
    setData: (data: IPaginationAuction<IAuction>) => void
    setCurrentPrice: (auctionId: string, amount: number) => void
}

const initialState: State = {
    auctions: [],
    pageCount: 0,
    totalCount: 0
}

export const useAuctionStore = create<State & Actions>((set) => ({
    ...initialState,

    setData: (data: IPaginationAuction<IAuction>) => {
        set(() => ({
            auctions: data.items,
            totalCount: data.count,
            pageCount: data.pageIndex
        }))
    },

    setCurrentPrice: (auctionId: string, amount: number) => {
        set((state) => ({
            auctions: state.auctions.map((auction) => auction.id === auctionId 
                ? {...auction, currentHighBid: amount} : auction)
        }))
    }
}))