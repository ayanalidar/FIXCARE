import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle, MapPin, Clock, CalendarCheck } from "lucide-react";
import { readContentBySlug } from "@/lib/content";
import { SITE, LOCATIONS } from "@/lib/site";
import Link from "next/link";

const slug = "contact-us";

export const metadata: Metadata = {
  title: "Contact FixCare Service Center — Jammu Appliance Repair",
  description:
    "Contact FixCare Service Center for same-day appliance repair across the Jammu region. Call +91 9XXXXXXXXX, WhatsApp 24/7, or book online. Certified technicians, genuine parts, written warranty.",
  keywords: [
    "contact FixCare Service Center",
    "appliance repair phone Jammu",
    "book repair",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact FixCare Service Center",
    description:
      "Same-day appliance repair across the Jammu region. Call, WhatsApp, or book online — 24/7.",
    url: `${SITE.domain}/contact`,
    type: "website",
  },
};

const HOURS_ROWS = [
  ["Monday", "24 hours"],
  ["Tuesday", "24 hours"],
  ["Wednesday", "24 hours"],
  ["Thursday", "24 hours"],
  ["Friday", "24 hours"],
  ["Saturday", "24 hours"],
  ["Sunday", "24 hours"],
  ["Public Holidays", "24 hours"],
];

export default function ContactPage() {
  const { frontmatter } = readContentBySlug("brand-pages", slug);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ApplianceRepair",
    name: "FixCare Service Center",
    description: frontmatter.meta_description,
    url: `${SITE.domain}/contact`,
    telephone: "+91-9XXXXXXXXX",
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jammu",
      addressRegion: "Jammu & Kashmir",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "32.7266",
      longitude: "74.8570",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    areaServed: LOCATIONS.map((l) => ({ "@type": "City", name: l.name })),
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    "Jammu, Jammu & Kashmir, India"
  )}&z=12&output=embed`;

  return (
    <div>
      <PageHero
        eyebrow="FixCare · Contact"
        title={frontmatter.title.replace(/\s+—\s+.*$/, "").replace(/\s+\|\s+.*$/, "")}
        subtitle={frontmatter.meta_description}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {/* NAP block */}
            <Card className="bg-card">
              <CardContent className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                <div>
                  <h2 className="text-lg font-semibold text-primary">
                    Our Details
                  </h2>
                  <ul className="mt-3 space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                      <span className="text-muted-foreground">
                        <strong className="text-primary">Address:</strong>{" "}
                        Jammu, Jammu &amp; Kashmir, India
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                      <span className="text-muted-foreground">
                        <strong className="text-primary">Phone:</strong>{" "}
                        <a
                          href={SITE.phoneHref}
                          className="font-medium text-accent hover:text-primary"
                        >
                          {SITE.phone}
                        </a>{" "}
                        (24/7)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MessageCircle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                      <span className="text-muted-foreground">
                        <strong className="text-primary">WhatsApp:</strong>{" "}
                        <a
                          href={SITE.whatsappLink(
                            "Hi FixCare, I need appliance repair"
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-accent hover:text-primary"
                        >
                          {SITE.phone}
                        </a>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                      <span className="text-muted-foreground">
                        <strong className="text-primary">Email:</strong>{" "}
                        <a
                          href={SITE.emailHref}
                          className="font-medium text-accent hover:text-primary"
                        >
                          {SITE.email}
                        </a>
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-primary">
                    Service Hours
                  </h2>
                  <div className="mt-3 overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <tbody>
                        {HOURS_ROWS.map(([day, hours]) => (
                          <tr key={day} className="border-b border-border last:border-0">
                            <td className="bg-background px-3 py-2 font-medium text-primary">
                              {day}
                            </td>
                            <td className="bg-background px-3 py-2 text-right text-muted-foreground">
                              {hours}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3.5 text-accent" aria-hidden="true" />
                    Phone, WhatsApp, and online booking are all monitored 24/7.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Three ways to reach us */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                Three Ways to Reach Us
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <Card className="bg-card">
                  <CardContent className="space-y-3 p-6">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Phone className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-semibold text-primary">
                      1. Call Us — 24/7
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      For the fastest spoken response, call us any time of day or
                      night. We&apos;ll ask for the appliance type, brand, and a
                      brief description of the problem, then schedule a
                      technician for the earliest available slot.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <a href={SITE.phoneHref}>Call {SITE.phone}</a>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardContent className="space-y-3 p-6">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <MessageCircle className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-semibold text-primary">
                      2. WhatsApp Us — Instant Chat
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Send photos or a short video of the appliance, the error
                      code displayed, or the fault symptom — this helps our
                      technician arrive prepared with the right spare parts and
                      tools.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={SITE.whatsappLink(
                          "Hi FixCare, I need appliance repair"
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open WhatsApp
                      </a>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardContent className="space-y-3 p-6">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <CalendarCheck className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-semibold text-primary">
                      3. Book Online — 60-Second Form
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Use our online booking form to book a repair in under a
                      minute. You&apos;ll immediately receive an SMS confirmation
                      with your booking reference and assigned technician.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/book-repair">Book Online</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                Find Us on the Map
              </h2>
              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                <iframe
                  title="Map of Jammu, Jammu & Kashmir"
                  src={mapSrc}
                  width="100%"
                  height="360"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Our base of operations is in Jammu city, with technicians
                dispatched daily to surrounding districts across the Jammu
                region.
              </p>
            </div>

            {/* Service area */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                Service Area
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                FixCare Service Center serves eight cities across the Jammu
                region: Jammu city (same-day), Kathua, Samba, Udhampur, Reasi
                (next-day), and Rajouri, Poonch, Doda (2-day). Visit our{" "}
                <Link
                  href="/locations"
                  className="font-semibold text-accent hover:text-primary"
                >
                  Locations page
                </Link>{" "}
                for area-specific contact details, neighborhoods covered, and
                local notes for each city. If your area isn&apos;t listed, call us
                — we may still be able to help.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {LOCATIONS.map((l) => (
                  <Link
                    key={l.slug}
                    href={l.href}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <MapPin className="size-3" aria-hidden="true" />
                    {l.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar — quick actions */}
          <aside className="space-y-6">
            <Card className="bg-card sticky top-24">
              <CardContent className="space-y-4 p-6">
                <h3 className="text-base font-semibold text-primary">
                  Reach FixCare Now
                </h3>
                <p className="text-sm text-muted-foreground">
                  Appliance failures don&apos;t wait for business hours — neither
                  do we. Pick the channel that works for you.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <a href={SITE.phoneHref}>
                      <Phone className="size-4" aria-hidden="true" />
                      Call {SITE.phone}
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href={SITE.whatsappLink("Hi FixCare, I need appliance repair")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      WhatsApp Us
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={SITE.emailHref}>
                      <Mail className="size-4" aria-hidden="true" />
                      Email Us
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/book-repair">
                      <CalendarCheck className="size-4" aria-hidden="true" />
                      Book a Repair
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <CTASection
        title="Pick the Channel That Works for You"
        subtitle="Whether you prefer to call, text, email, or fill an online form, our team is ready to help. Same-day service in Jammu city, next-day across the rest of the Jammu region."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </div>
  );
}
