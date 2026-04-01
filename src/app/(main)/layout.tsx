import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { MainContent } from "@/components/layout/MainContent"
import { GameNotifications } from "@/components/game/GameNotifications"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <Header />
      <MainContent>{children}</MainContent>
      <GameNotifications />
    </>
  )
}
