import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppWidget } from "@/components/site/whatsapp-widget";
import { PWAInstallPrompt } from "@/components/site/pwa-install-prompt";
import { ServiceWorkerRegister } from "@/components/site/service-worker-register";
import { SITE } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "FixCare Service Center - Same-Day Appliance Repair in Jammu | 24/7 Service",
    template: "%s | FixCare Service Center",
  },
  description:
    "Jammu region's trusted multi-brand appliance repair service. Same-day washing machine, fridge, AC, microwave, dishwasher & water dispenser repair across 8 cities. Certified technicians, genuine parts, warranty. Call now.",
  keywords: [
    "appliance repair Jammu",
    "same-day appliance repair",
    "certified technician Jammu",
    "multi-brand repair service",
    "FixCare Service Center",
  ],
  authors: [{ name: "FixCare Service Center" }],
  manifest: "/manifest.json",
  applicationName: "FixCare Service Center",
  appleWebApp: {
    capable: true,
    title: "FixCare Service Center",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/icons/favicon.ico"],
  },
  openGraph: {
    title: "FixCare Service Center - Same-Day Appliance Repair in Jammu",
    description:
      "Jammu region's trusted multi-brand appliance repair service. Certified technicians, genuine parts, written warranty.",
    url: SITE.domain,
    siteName: "FixCare Service Center",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "FixCare Service Center - Same-Day Appliance Repair in Jammu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FixCare Service Center",
    description: "Same-day appliance repair across the Jammu region - certified technicians, genuine parts, written warranty.",
    images: ["/icons/og-image.png"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  appLinks: {
    web: {
      url: SITE.domain,
      should_fallback: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F2540" },
    { media: "(prefers-color-scheme: dark)", color: "#0F2540" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA: preconnect to Google Fonts for faster font load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <WhatsAppWidget />
        <PWAInstallPrompt />
        <ServiceWorkerRegister />
        <Toaster />
      </body>
    </html>
  );
}
