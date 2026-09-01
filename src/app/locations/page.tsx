import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { LocationCard } from "@/components/site/location-card";
import { LOCATIONS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Appliance Repair Locations Across the Kashmir Valley",
  description:
    "WeCare Home Solutions serves Srinagar (same-day) plus Anantnag, Baramulla, Budgam, Pulwama, Ganderbal, Bandipora and Kupwara on a next-day basis. Certified technicians, genuine parts, written warranty.",
  alternates: { canonical: "/locations" },
};

export default function LocationsHub() {
  return (
    <div>
      <PageHero
        eyebrow="Service Areas"
        title="Appliance Repair Across the Kashmir Valley"
        subtitle="Same-day service in Srinagar, next-day service across the rest of the Valley. Tap your city below for local contact details, neighborhoods covered and area-specific information."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.map((l) => (
            <LocationCard
              key={l.slug}
              name={l.name}
              neighborhoods={l.neighborhoods}
              href={l.href}
              serviceType={l.serviceType}
            />
          ))}
        </div>
        <div className="mt-10 rounded-lg border border-accent/30 bg-accent/5 p-6">
          <p className="text-sm text-muted-foreground">
            Don&apos;t see your area listed? Call us — we frequently travel to
            areas beyond this list and may be able to help. Use the pincode
            checker on our{" "}
            <Link href="/" className="font-semibold text-accent hover:text-primary">
              homepage
            </Link>{" "}
            or call us at{" "}
            <a
              href="tel:+919XXXXXXXXX"
              className="font-semibold text-accent hover:text-primary"
            >
              +91 9XXXXXXXXX
            </a>
            .
          </p>
        </div>
      </section>
      <CTASection />
    </div>
  );
}
