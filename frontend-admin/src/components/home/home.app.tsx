'use client'

import '../../styles/app.scss'
import { signOut, useSession } from "next-auth/react"
import { useEffect } from "react";
import HeaderApp from "../header/header.app";
import Layout, { Content, Footer, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import MenuApp from '../menu/menu.app';
import FooterApp from '../footer/footer.app';
import { useRouter } from 'next/navigation';
import SignalRProvider from '@/lib/SignalRProvider';

const headerStyle: React.CSSProperties = {
    height: '11.5vh', 
    marginBottom: '1rem',
    background:'white'
};
  
const contentStyle: React.CSSProperties = {
    margin: '0 1rem 0 1rem',
    overflowX: "hidden"
};
  
const siderStyle: React.CSSProperties = {
    margin: '0 0 0 2rem', 
    borderRadius: '0.5rem', 
    flex: '0 0 25%',
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
const HomeApp=({
    children,
  }: {
    children: React.ReactNode
  })=>{
    const { data:session,status } = useSession()
    const router = useRouter()    
    useEffect(() => {
        if (status === "loading") return;

        if (!session?.user) {
            router.push("/auth/signin");
            return;
        }

        if (session?.error === "RefreshAccessTokenError") {
            signOut({
                callbackUrl: "/auth/signin",
            });
        }
    }, [session, status, router]);
    return(
        <Layout style={layoutStyleParent}>
            <Header style={headerStyle}>
               <HeaderApp/>
            </Header>
            <Layout style={layoutStyleChildren}>
                <Sider width="4%" style={siderStyle}>
                   <MenuApp/>
                </Sider>
                <Content style={contentStyle}>
                  <SignalRProvider>
                    {children}
                  </SignalRProvider>
                </Content>
            </Layout>
            <FooterApp/>
        </Layout>
    )
}
export default HomeApp
