'use client'

import '../../styles/app.scss'
import { signOut, useSession } from "next-auth/react"
import { useEffect } from "react";
import HeaderApp from "../header/header.app";
import Layout, { Header } from 'antd/es/layout/layout';
import ModalGeneral from '../modal/modal.general';
import SignalRProvider from '@/providers/SignalRProvider';
import FooterApp from '../footer/footer.app';

const headerStyle: React.CSSProperties = {
    height: '11.5vh', 
    marginBottom: '1.5rem',
    background:'white'
};
  
const layoutStyleParent: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    maxWidth: '100vw',
    backgroundColor: '#efefef',
};

const layoutStyleChildren: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    backgroundColor: '#efefef',
    height:"auto"
};

const HomeApp= (
    {children,}: {children: React.ReactNode}
)=>{
    const { data:session } = useSession()
    useEffect(() => {
        if (session?.error === "RefreshAccessTokenError") {
            signOut()
        }
    }, [session]);
    return(
        <Layout style={layoutStyleParent}>
            <Header style={headerStyle}>
               <HeaderApp/>
            </Header>
            <Layout style={layoutStyleChildren}>
                <SignalRProvider>
                  {children}
                </SignalRProvider>
            </Layout>
            <FooterApp/>
            <ModalGeneral/>
        </Layout>
    )
}
export default HomeApp
