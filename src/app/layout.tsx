import type { Metadata } from "next"
import "./globals.css"
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
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
