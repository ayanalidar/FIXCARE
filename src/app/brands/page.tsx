import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownContent } from "@/components/site/markdown-content";
import { Wrench, ShieldCheck, CheckCircle2, Globe } from "lucide-react";
import { readContentBySlug } from "@/lib/content";
import { SITE, BRANDS } from "@/lib/site";

const slug = "brands-we-service";

export const metadata: Metadata = {
  title: "Brands We Service — Certified Repair for All Major Appliance Brands | FixCare",
  description:
    "FixCare Service Center services Samsung, LG, Whirlpool, Bosch, IFB, Godrej, Haier, Voltas, and Panasonic appliances across the Jammu region. Brand-trained technicians, genuine parts, written warranty.",
  keywords: [
    "Samsung repair Jammu",
    "LG repair Jammu",
    "Whirlpool repair Jammu",
    "Bosch repair Jammu",
    "appliance brands serviced",
  ],
  alternates: { canonical: "/brands" },
  openGraph: {
    title: "Brands We Service — FixCare Service Center",
    description:
      "Certified repair for Samsung, LG, Whirlpool, Bosch, IFB, Godrej, Haier, Voltas, and Panasonic appliances across the Jammu region.",
    url: `${SITE.domain}/brands`,
    type: "website",
  },
};

interface BrandDetail {
  name: string;
  blurb: string;
}

function parseBrandDetails(markdown: string): BrandDetail[] {
  // Extract sections under ## Brand Cards
  const brandCardsMatch = markdown.match(
    /##\s*Brand Cards([\s\S]*?)(?=\n##\s|$)/
  );
  const section = brandCardsMatch ? brandCardsMatch[1] : "";
  const details: BrandDetail[] = [];
  const parts = section.split(/^###\s+(.+)$/m);
  // parts[0] = text before first ###, then pairs (heading, body)
  for (let i = 1; i < parts.length; i += 2) {
    const name = parts[i].trim();
    const body = (parts[i + 1] ?? "").trim();
    if (name && body) {
      details.push({ name, blurb: body });
    }
  }
  return details;
}

function brandInitials(name: string): string {
  return name
    .slice(0, 2)
    .toUpperCase();
}

export default function BrandsPage() {
  const { frontmatter, content } = readContentBySlug("brand-pages", slug);
  const brandDetails = parseBrandDetails(content);

  // Render remaining content sections (intro + Why Brand-Specific matters)
  const introMatch = content.match(/^[\s\S]*?(?=##\s*Brand Cards)/);
  const introText = introMatch ? introMatch[0] : "";
  const introClean = introText
    .replace(/^#\s+.+$/m, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();

  // Extract "Why Brand-Specific Expertise Matters" section
  const whySectionMatch = content.match(
    /##\s*Why Brand-Specific Expertise Matters[\s\S]*?(?=\n##\s|$)/
  );
  const whyText = whySectionMatch ? whySectionMatch[0].replace(/^##\s+/, "") : "";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FixCare Service Center",
    url: SITE.domain,
    description: frontmatter.meta_description,
    brand: BRANDS.map((b) => ({ "@type": "Brand", name: b })),
  };

  return (
    <div>
      <PageHero
        eyebrow="FixCare · Brand Expertise"
        title={frontmatter.title.replace(/\s+—\s+.*$/, "").replace(/\s+\|\s+.*$/, "")}
        subtitle={frontmatter.meta_description}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Intro */}
        {introClean && (
          <div className="max-w-3xl">
            <MarkdownContent content={introClean} />
          </div>
        )}

        {/* Brand cards grid */}
        <h2 className="mt-12 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Nine Appliance Brands, One Phone Call
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Instead of being a single-brand service center, our technicians are
          cross-trained on Korean, American, European, Indian, Chinese, and
          Japanese brands so you only need one phone call no matter what is in
          your kitchen, laundry, or living room.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brandDetails.map((b) => (
            <Card key={b.name} className="bg-card transition-shadow hover:shadow-md">
              <CardContent className="space-y-3 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg font-bold tracking-tight">
                    {brandInitials(b.name)}
                  </span>
                  <h3 className="text-lg font-semibold text-primary">{b.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {b.blurb}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why brand-specific matters */}
        {whyText && (
          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Why Brand-Specific Expertise Matters
            </h2>
            <div className="mt-4">
              <MarkdownContent content={whyText.replace(/^Why Brand-Specific Expertise Matters\s*\n/, "")} />
            </div>
          </div>
        )}

        {/* Value props */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card className="bg-card">
            <CardContent className="space-y-3 p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Wrench className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-primary">
                Genuine spare parts
              </h3>
              <p className="text-sm text-muted-foreground">
                Every part we install is sourced directly from the brand&apos;s
                authorized J&amp;K distributor — no duplicates, no refurbished
                parts without your explicit consent.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="space-y-3 p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-primary">
                Written warranty on every repair
              </h3>
              <p className="text-sm text-muted-foreground">
                Each completed repair includes a warranty card specifying the
                covered part, warranty period, and your unique reference number.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="space-y-3 p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Globe className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-primary">
                Cross-brand trained technicians
              </h3>
              <p className="text-sm text-muted-foreground">
                Our team reads Samsung&apos;s 4E code and LG&apos;s OE code with
                equal confidence, so a multi-brand household only needs one phone
                call.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Check list */}
        <div className="mt-10 rounded-lg border border-accent/30 bg-accent/5 p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <CheckCircle2 className="size-4 text-accent" aria-hidden="true" />
            We service all 9 major brands across all 8 cities we cover
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Same-day in Jammu city, next-day across Kathua, Samba, Udhampur and
            Reasi, 2-day service to Rajouri, Poonch and Doda.
          </p>
        </div>
      </section>

      <CTASection
        title="Book a Repair for Any Brand"
        subtitle="Whatever brand of appliance has stopped working in your home, our team is ready to help — usually the same day in Jammu city, and next-day across the rest of the Jammu region."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </div>
  );
}
