import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Viewport } from "next";


import GoogleAnalytics from "@/components/ga4/google-analytics-4";


export const viewport: Viewport = {
  maximumScale: 1,
  initialScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL!),
  title: `Yangoos Blog`,
  description: `데이터를 종합해 정보를 만듭니다.`,
  openGraph: {
    images: "/og/og-default.png",
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION!,
    other: {
      "naver-site-verification": process.env.NAVER_VERIFICATION!,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <GoogleAnalytics GA_TRACKING_ID={process.env.GA_TRACKING_ID!} />
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2341342262931969"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body className={`h-lvh flex flex-col w-full `}>

          {children}

      </body>
    </html>
  );
}
