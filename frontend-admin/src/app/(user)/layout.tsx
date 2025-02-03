import HomeApp from "@/components/home/home.app"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
       <HomeApp>{children}</HomeApp>
    </>
  )
}
