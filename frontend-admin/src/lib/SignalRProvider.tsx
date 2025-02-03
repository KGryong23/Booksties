'use client'

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { useSession } from 'next-auth/react'
import { ReactNode, useCallback, useEffect, useRef } from 'react'

type Props = {
    children: ReactNode
}

export default function SignalRProvider({ children }: Props) {
    const { data: session, update } = useSession();
    const connection = useRef<HubConnection | null>(null);

    const sessionRef = useRef(session);

    useEffect(() => {
        sessionRef.current = session;
    }, [session]);

    const handleRoleChanged = useCallback((roleChanged: IRoleChanged) => {
        console.log(sessionRef.current?.user.roleId, roleChanged);
        if (sessionRef.current?.user.roleId === roleChanged.roleId) {
            update();
        }
    }, [update]);

    const handleUserRoleChanged = useCallback((userRoleChanged: IUserRoleChanged) => {
        console.log(sessionRef.current?.user.userId, userRoleChanged);
        if (sessionRef.current?.user.userId === userRoleChanged.userId) {
            update();
        }
    }, [update]);

    useEffect(() => {
        if (!connection.current) {
            connection.current = new HubConnectionBuilder()
                .withUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications`)
                .withAutomaticReconnect()
                .build();

            connection.current.start()
                .then(() => console.log('Connected to notification hub'))
                .catch(err => console.log(err));
        }

        connection.current.on('RoleChanged', handleRoleChanged);
        connection.current.on('UserRoleChanged', handleUserRoleChanged);
        
        return () => {
            connection.current?.off('RoleChanged', handleRoleChanged);
            connection.current?.off('UserRoleChanged', handleUserRoleChanged);
        };
    }, [handleRoleChanged, handleUserRoleChanged]);

    return children;
}

