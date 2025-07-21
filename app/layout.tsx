import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChatFlow - The Future of Communication",
  description:
    "Experience real-time messaging with AI assistance, universal translation, and seamless file sharing in a beautifully designed interface.",
  keywords: "chat, messaging, real-time, AI, translation, communication, WebSocket, SaaS",
  authors: [{ name: "ChatFlow Team" }],
  creator: "ChatFlow Team",
  publisher: "ChatFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://chatflow.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ChatFlow - The Future of Communication",
    description: "Experience real-time messaging with AI assistance, universal translation, and seamless file sharing.",
    type: "website",
    url: "https://chatflow.app",
    siteName: "ChatFlow",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200",
        width: 1200,
        height: 630,
        alt: "ChatFlow - Modern Chat Application",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatFlow - The Future of Communication",
    description: "Experience real-time messaging with AI assistance, universal translation, and seamless file sharing.",
    images: ["/placeholder.svg?height=630&width=1200"],
    creator: "@chatflow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#8b5cf6" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ChatFlow" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} theme-transition`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
