import type { Metadata } from "next"
import "./globals.css"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { MainContent } from "@/components/layout/MainContent"
import { GameNotifications } from "@/components/game/GameNotifications"
import { AuthProvider } from "@/components/auth/AuthProvider"

export const metadata: Metadata = {
  title: "GCP Interactive Learning Platform",
  description: "Google Cloud Platform の製品デモ・アーキテクチャ・資格学習を体験できるインタラクティブ学習環境",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground antialiased">
        <AuthProvider>
          <Sidebar />
          <Header />
          <MainContent>{children}</MainContent>
          <GameNotifications />
        </AuthProvider>
      </body>
    </html>
  )
}
