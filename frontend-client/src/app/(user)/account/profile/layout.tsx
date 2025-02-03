import ProfileApp from "@/components/profile/profile.app"

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
         <ProfileApp>
            {children}
         </ProfileApp>
      </>
    )
  }