import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { FAQAccordion, type FAQItem } from "@/components/site/faq-accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { readContentBySlug } from "@/lib/content";
import { SITE } from "@/lib/site";
import { MessageCircle, Phone } from "lucide-react";

const slug = "faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Appliance Repair in the Jammu Region",
  description:
    "Answers to 15+ common questions about appliance repair in the Jammu region — service timing, visit fees, certified technicians, genuine parts, warranty, pricing, and booking with FixCare Service Center.",
  keywords: [
    "appliance repair FAQ Jammu",
    "washing machine repair questions",
    "AC service cost",
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Frequently Asked Questions — FixCare Service Center",
    description:
      "Answers to 15+ common questions about appliance repair in the Jammu region.",
    url: `${SITE.domain}/faq`,
    type: "website",
  },
};

interface FaqGroup {
  category: string;
  items: FAQItem[];
}

/**
 * Parse the FAQ markdown body into groups based on ## headings.
 * Each ## becomes a category, and each ### within it becomes a Q/A.
 */
function parseFAQGroups(markdown: string): FaqGroup[] {
  const cleaned = markdown
    .replace(/^#\s+.+$/m, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n---\n[\s\S]*$/, "")
    .trim();

  const groups: FaqGroup[] = [];
  // Split on H2 categories
  const h2Sections = cleaned.split(/^##\s+(.+)$/m);
  // h2Sections[0] is the intro text (skip), then pairs of (heading, body)
  for (let i = 1; i < h2Sections.length; i += 2) {
    const category = h2Sections[i].trim();
    const body = h2Sections[i + 1] ?? "";
    // Skip non-FAQ trailing sections like "Still Have Questions?"
    if (/^(Still Have Questions|Book a Repair|Leave a Review)/i.test(category)) {
      continue;
    }
    const items: FAQItem[] = [];
    const h3Matches = body.matchAll(/###\s+(.+?)\n([\s\S]*?)(?=\n###|$)/g);
    for (const m of h3Matches) {
      const question = m[1].trim();
      const answer = m[2].trim();
      if (question && answer) {
        items.push({ question, answer });
      }
    }
    if (items.length > 0) {
      groups.push({ category, items });
    }
  }
  return groups;
}

export default function FAQPage() {
  const { frontmatter, content } = readContentBySlug("brand-pages", slug);
  const groups = parseFAQGroups(content);

  const allFaqs = groups.flatMap((g) => g.items);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  return (
    <div>
      <PageHero
        eyebrow="FixCare · Help Center"
        title={frontmatter.title.replace(/\s+—\s+.*$/, "").replace(/\s+\|\s+.*$/, "")}
        subtitle={frontmatter.meta_description}
      />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-base leading-relaxed text-muted-foreground">
          We&apos;ve answered the questions our customers across the Jammu region
          ask us most often — about how fast we reach, what we charge, the parts
          we use, our warranty, and how to book a repair. If your question isn&apos;t
          covered below, just call or WhatsApp us and we&apos;ll answer it
          directly.
        </p>

        <div className="mt-10 space-y-10">
          {groups.map((g) => (
            <div key={g.category}>
              <h2 className="mb-4 text-xl font-bold tracking-tight text-primary sm:text-2xl">
                {g.category}
              </h2>
              <FAQAccordion items={g.items} />
            </div>
          ))}
        </div>

        <Card className="mt-12 bg-card">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary">
                Still have questions?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Our team is happy to answer directly — 24/7, including holidays.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <a
                  href={SITE.whatsappLink("Hi FixCare, I have a question")}
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
      </section>

      <CTASection
        title="Ready to Get Your Appliance Fixed?"
        subtitle="If the answers above have helped you decide, the next step is simple — book a repair now and a certified FixCare technician will be at your door the same day in Jammu city, or the next day across the rest of the Jammu region."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
