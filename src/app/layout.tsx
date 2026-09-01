import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppWidget } from "@/components/site/whatsapp-widget";
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
    default: "WeCare Home Solutions — Same-Day Appliance Repair in Kashmir | 24/7 Service",
    template: "%s | WeCare Home Solutions",
  },
  description:
    "Kashmir's trusted multi-brand appliance repair service. Same-day washing machine, fridge, AC, microwave, dishwasher & water dispenser repair across 10+ cities. Certified technicians, genuine parts, warranty. Call now.",
  keywords: [
    "appliance repair Kashmir",
    "same-day appliance repair",
    "certified technician Kashmir",
    "multi-brand repair service",
    "WeCare Home Solutions",
  ],
  authors: [{ name: "WeCare Home Solutions" }],
  openGraph: {
    title: "WeCare Home Solutions — Same-Day Appliance Repair in Kashmir",
    description:
      "Kashmir's trusted multi-brand appliance repair service. Certified technicians, genuine parts, written warranty.",
    url: SITE.domain,
    siteName: "WeCare Home Solutions",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeCare Home Solutions",
    description: "Same-day appliance repair across Kashmir — certified technicians, genuine parts, written warranty.",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <WhatsAppWidget />
        <Toaster />
      </body>
    </html>
  );
}
