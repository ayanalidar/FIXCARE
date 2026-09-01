import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { ServiceCard } from "@/components/site/service-card";
import { LOCATIONS, SERVICES, SITE } from "@/lib/site";
import { Wrench, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Appliance Repair Services in Jammu Region - All Major Home Appliances",
  description:
    "FixCare Service Center repairs washing machines, refrigerators, ACs, microwaves, water dispensers and dishwashers across the Jammu region. Same-day in Jammu city, next-day across the region.",
  alternates: { canonical: "/services" },
};

export default function ServicesHub() {
  return (
    <div>
      <PageHero
        eyebrow="Our Services"
        title="Appliance Repair Services Across the Jammu Region"
        subtitle="Six dedicated service categories, certified specialists for each, genuine spare parts and a written warranty on every repair. Same-day in Jammu city, next-day across the rest of the region."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.slug}
              icon={s.icon}
              name={s.name}
              blurb={s.blurb}
              href={s.href}
            />
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Wrench className="size-5 text-accent" aria-hidden="true" />
              Genuine parts, every repair
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We source spare parts directly from brand-authorized distributors in
              Jammu &amp; Kashmir. Every part we install comes with the
              manufacturer&apos;s own warranty plus our own written warranty on top.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
              <MapPin className="size-5 text-accent" aria-hidden="true" />
              Serving {LOCATIONS.length} cities across the Jammu region
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Same-day service in Jammu city. Next-day across Kathua, Samba,
              Udhampur and Reasi. 2-day service to Rajouri, Poonch and Doda.
            </p>
            <Link
              href="/locations"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-primary"
            >
              See all locations
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  );
}
