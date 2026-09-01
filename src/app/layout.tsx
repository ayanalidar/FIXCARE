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
    default: "FixCare Service Center — Same-Day Appliance Repair in Jammu | 24/7 Service",
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
  openGraph: {
    title: "FixCare Service Center — Same-Day Appliance Repair in Jammu",
    description:
      "Jammu region's trusted multi-brand appliance repair service. Certified technicians, genuine parts, written warranty.",
    url: SITE.domain,
    siteName: "FixCare Service Center",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "FixCare Service Center",
    description: "Same-day appliance repair across the Jammu region — certified technicians, genuine parts, written warranty.",
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
