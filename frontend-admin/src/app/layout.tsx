import type { Metadata } from 'next'
import "../styles/app.scss"
import StyledComponentsRegistry from '@/lib/antd.registry'
import NextAuthWrapper from '@/lib/next.auth.wrapper'
import HomeApp from '@/components/home/home.app'


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
         <StyledComponentsRegistry>
          <NextAuthWrapper>
               {children}
          </NextAuthWrapper>
         </StyledComponentsRegistry>
      </body>
    </html>
  )
}


