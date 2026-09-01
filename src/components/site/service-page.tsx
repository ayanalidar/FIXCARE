import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { FAQAccordion } from "@/components/site/faq-accordion";
import { MarkdownContent } from "@/components/site/markdown-content";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { readContentBySlug, type PageFrontmatter } from "@/lib/content";
import { SERVICES, LOCATIONS, SITE } from "@/lib/site";

export interface ServicePageInput {
  slug: string;
  icon: string;
  shortName: string;
}

export function buildServiceMetadata(
  fm: PageFrontmatter,
  slug: string
): Metadata {
  return {
    title: fm.title,
    description: fm.meta_description,
    keywords: fm.target_keywords,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: fm.title,
      description: fm.meta_description,
      url: `${SITE.domain}/services/${slug}`,
      type: "website",
    },
  };
}

/**
 * Extracts the FAQ Q&A pairs from the markdown body (sections under an "FAQ"
 * H2) and returns them as a structured list for use in the FAQAccordion
 * component + FAQPage schema.
 */
function extractFAQs(markdown: string): { question: string; answer: string }[] {
  const faqMatch = markdown.match(
    /##\s*(?:Frequently Asked Questions|FAQ)[\s\S]*?(?=##\s*(?:Ready to|Book|.*Book a Repair|$))/
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

/**
 * Extracts the first testimonial blockquote from the markdown body.
 */
function extractTestimonial(
  markdown: string
): { quote: string; name: string } | null {
  const m = markdown.match(
    />\s*"([^"]+)"\s*\n>\s*—\s*\*\*([^*]+)\*\*/
  );
  if (!m) return null;
  return { quote: m[1].trim(), name: m[2].trim() };
}

export function ServicePage({ slug, icon, shortName }: ServicePageInput) {
  const { frontmatter, content } = readContentBySlug("service-pages", slug);
  const faqs = extractFAQs(content);
  const testimonial = extractTestimonial(content);

  // Strip the trailing footer/separator/CTA blocks that live inside the .md file
  const cleanedBody = content
    .replace(/^#\s+.+$/m, "") // remove H1 (we render our own PageHero title)
    .replace(/<!--[\s\S]*?-->/g, "") // remove HTML comments
    .replace(/\n---\n[\s\S]*$/, "") // remove trailing hr + footer
    .trim();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: frontmatter.title,
    description: frontmatter.meta_description,
    provider: {
      "@type": "ApplianceRepair",
      name: "FixCare Service Center",
      telephone: "+91-70515-87802",
      areaServed: LOCATIONS.map((l) => ({ "@type": "City", name: l.name })),
    },
    areaServed: LOCATIONS.map((l) => ({ "@type": "City", name: l.name })),
    serviceType: shortName,
    url: `${SITE.domain}/services/${slug}`,
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

  return (
    <div>
      <PageHero
        eyebrow={`FixCare Services · ${shortName}`}
        title={frontmatter.title.replace(/\s+—\s+.*$/, "").replace(/\s+\|\s+.*$/, "")}
        subtitle={frontmatter.meta_description}
      />

      <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <MarkdownContent content={cleanedBody} />

            {/* Testimonial extracted from body */}
            {testimonial && (
              <div className="mt-10">
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  location="Verified FixCare customer"
                />
              </div>
            )}

            {/* FAQ accordion */}
            {faqs.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-primary">
                  Frequently Asked Questions
                </h2>
                <FAQAccordion items={faqs} />
                <p className="mt-4 text-sm text-muted-foreground">
                  See our full{" "}
                  <Link href="/faq" className="font-semibold text-accent hover:text-primary">
                    FAQ page
                  </Link>{" "}
                  for more answers.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="bg-card sticky top-24">
              <CardContent className="space-y-4 p-6">
                <div>
                  <h3 className="text-base font-semibold text-primary">
                    Book {shortName} repair
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Same-day service in Jammu city. Next-day across the rest of
                    the Jammu region. Genuine parts. Written warranty.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/book-repair">Book a Repair Online</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href={SITE.whatsappLink(`Hi FixCare, I need ${shortName} repair`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp Us
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={SITE.phoneHref}>Call {SITE.phone}</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="space-y-3 p-6">
                <h3 className="text-base font-semibold text-primary">
                  Other services
                </h3>
                <ul className="space-y-2 text-sm">
                  {SERVICES.filter((s) => s.slug !== slug).map((s) => (
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
                <h3 className="flex items-center gap-2 text-base font-semibold text-primary">
                  <MapPin className="size-4 text-accent" aria-hidden="true" />
                  Service areas
                </h3>
                <ul className="grid grid-cols-2 gap-1.5 text-sm">
                  {LOCATIONS.map((l) => (
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
                <Link
                  href="/locations"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-primary"
                >
                  All locations →
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </article>

      <CTASection
        title={`Ready to Get Your ${shortName} Fixed?`}
        subtitle="Don't let a pile of laundry sit for a week waiting on the brand service center. Book a repair now and a certified FixCare technician will be at your door the same day in Jammu city, or the next day across the rest of the Jammu region."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
