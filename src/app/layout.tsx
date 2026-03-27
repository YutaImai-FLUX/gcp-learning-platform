import type { Metadata } from "next"
import "./globals.css"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

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
      <body className="bg-background text-foreground antialiased">
        <Sidebar />
        <Header />
        <main className="ml-64 mt-14 min-h-[calc(100vh-3.5rem)] bg-[#f8f9fa] dark:bg-[#202124]">
          <div className="p-6 max-w-[1400px]">{children}</div>
        </main>
      </body>
    </html>
  )
}
