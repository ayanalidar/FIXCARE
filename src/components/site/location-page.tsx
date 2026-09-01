import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { FAQAccordion } from "@/components/site/faq-accordion";
import { MarkdownContent } from "@/components/site/markdown-content";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/site/service-card";
import { readContentBySlug, type PageFrontmatter } from "@/lib/content";
import { SERVICES, LOCATIONS, SITE, type LocationMeta } from "@/lib/site";
import { Phone, CalendarCheck, MessageCircle, MapPin, ArrowRight } from "lucide-react";

export function buildLocationMetadata(
  fm: PageFrontmatter,
  slug: string
): Metadata {
  return {
    title: fm.title,
    description: fm.meta_description,
    keywords: fm.target_keywords,
    alternates: { canonical: `/locations/${slug}` },
    openGraph: {
      title: fm.title,
      description: fm.meta_description,
      url: `${SITE.domain}/locations/${slug}`,
      type: "website",
    },
  };
}

function extractFAQs(markdown: string): { question: string; answer: string }[] {
  const faqMatch = markdown.match(
    /##\s*(?:Frequently Asked Questions|FAQ)[\s\S]*?(?=\n##\s*(?:Book a Repair|$))/
  );
  if (!faqMatch) return [];
  const section = faqMatch[0];
  const qas: { question: string; answer: string }[] = [];
  const h3Matches = section.matchAll(/###\s+(.+?)\n([\s\S]*?)(?=\n###|$)/g);
  for (const m of h3Matches) {
    const question = m[1].trim();
    const answer = m[2].trim();
    if (question && answer) {
      qas.push({ question, answer });
    }
  }
  return qas;
}

function extractTestimonial(
  markdown: string
): { quote: string; name: string } | null {
  const m = markdown.match(
    />\s*"([^"]+)"\s*\n>\s*—\s*\*\*([^*]+)\*\*/
  );
  if (!m) return null;
  return { quote: m[1].trim(), name: m[2].trim() };
}

export function LocationPage({ location }: { location: LocationMeta }) {
  const slug = location.slug;
  const { frontmatter, content } = readContentBySlug(
    "location-pages",
    slug
  );
  const faqs = extractFAQs(content);
  const testimonial = extractTestimonial(content);

  const cleanedBody = content
    .replace(/^#\s+.+$/m, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n---\n[\s\S]*$/, "")
    .trim();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ApplianceRepair",
    name: `WeCare Home Solutions — ${location.name}`,
    description: frontmatter.meta_description,
    url: `${SITE.domain}/locations/${slug}`,
    telephone: "+91-9XXXXXXXXX",
    areaServed: { "@type": "City", name: location.name },
    address: {
      "@type": "PostalAddress",
      addressLocality: location.name,
      addressRegion: "Jammu & Kashmir",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.lat,
      longitude: location.lng,
    },
    priceRange: "₹₹",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
  };

  const faqSchema = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      }
    : null;

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${location.name}, Jammu & Kashmir, India`
  )}&z=12&output=embed`;

  return (
    <div>
      <PageHero
        eyebrow={`WeCare Locations · ${location.name}`}
        title={frontmatter.title.replace(/\s+—\s+.*$/, "").replace(/\s+\|\s+.*$/, "")}
        subtitle={frontmatter.meta_description}
      />

      <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <MarkdownContent content={cleanedBody} />

            {/* Testimonial */}
            {testimonial && (
              <div className="mt-10">
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-primary">
                  Customer Story from {location.name}
                </h2>
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  location={`${location.name}, verified customer`}
                />
              </div>
            )}

            {/* Map */}
            <div className="mt-10">
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-primary">
                Find Us on the Map
              </h2>
              <div className="overflow-hidden rounded-lg border border-border">
                <iframe
                  title={`Map of ${location.name}, Jammu & Kashmir`}
                  src={mapSrc}
                  width="100%"
                  height="360"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Our base of operations is in Srinagar, with technicians dispatched
                daily to {location.name} and surrounding areas.
              </p>
            </div>

            {/* FAQ */}
            {faqs.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-primary">
                  Frequently Asked Questions — {location.name}
                </h2>
                <FAQAccordion items={faqs} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="bg-card sticky top-24">
              <CardContent className="space-y-4 p-6">
                <div>
                  <h3 className="text-base font-semibold text-primary">
                    Book a repair in {location.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {location.serviceType === "same-day"
                      ? "Same-day service available."
                      : "Next-day service from our Srinagar base."}{" "}
                    Certified technicians, genuine parts, written warranty.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/book-repair">
                      <CalendarCheck className="size-4" aria-hidden="true" />
                      Book a Repair
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href={SITE.whatsappLink(
                        `Hi WeCare, I need appliance repair in ${location.name}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      WhatsApp Us
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={SITE.phoneHref}>
                      <Phone className="size-4" aria-hidden="true" />
                      Call {SITE.phone}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="space-y-3 p-6">
                <h3 className="flex items-center gap-2 text-base font-semibold text-primary">
                  <MapPin className="size-4 text-accent" aria-hidden="true" />
                  Services in {location.name}
                </h3>
                <ul className="space-y-2 text-sm">
                  {SERVICES.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={s.href}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-accent"
                      >
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="space-y-3 p-6">
                <h3 className="text-base font-semibold text-primary">
                  Other locations
                </h3>
                <ul className="grid grid-cols-2 gap-1.5 text-sm">
                  {LOCATIONS.filter((l) => l.slug !== slug).map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={l.href}
                        className="text-muted-foreground hover:text-accent"
                      >
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Services grid */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            Our Appliance Repair Services in {location.name}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We repair every major home appliance in {location.name} with the same
            certified specialists and genuine parts we use across the rest of
            Kashmir.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>
      </article>

      <CTASection
        title={`Book a Repair in ${location.name}`}
        subtitle={`Don't let a broken appliance disrupt your home. A certified WeCare technician can be at your door in ${location.name} the ${
          location.serviceType === "same-day" ? "same" : "next"
        } day with genuine parts and a written warranty.`}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </div>
  );
}
