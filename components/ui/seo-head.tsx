import Head from "next/head"

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
}

export function SEOHead({
  title = "ChatFlow - The Future of Communication",
  description = "Experience real-time messaging with AI assistance, universal translation, and seamless file sharing in a beautifully designed interface.",
  image = "/placeholder.svg?height=630&width=1200",
  url = "https://chatflow.app",
  type = "website",
}: SEOHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="ChatFlow" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ChatFlow Team" />
      <meta name="keywords" content="chat, messaging, real-time, AI, translation, communication, WebSocket" />
      <link rel="canonical" href={url} />

      {/* PWA */}
      <meta name="theme-color" content="#8b5cf6" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="ChatFlow" />
    </Head>
  )
}
