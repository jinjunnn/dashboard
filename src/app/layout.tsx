import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "股票信号分析",
    startupImage: [
      {
        url: "/icons/icon-192x192.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "股票信号分析系统",
    title: APP_CONFIG.meta.title,
    description: APP_CONFIG.meta.description,
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "股票信号分析系统",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_CONFIG.meta.title,
    description: APP_CONFIG.meta.description,
    images: ["/icons/icon-512x512.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "股票信号分析",
    "application-name": "股票信号分析系统",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange enableSystem={false}>
          {children}
          <Toaster />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
