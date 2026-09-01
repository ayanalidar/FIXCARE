import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle } from "lucide-react";
import { readContentBySlug } from "@/lib/content";
import { SITE } from "@/lib/site";

const slug = "reviews";

export const metadata: Metadata = {
  title: "Customer Reviews - FixCare Service Center Jammu",
  description:
    "Read verified customer reviews of FixCare Service Center across the Jammu region. 4.8-star average rating from 9 verified reviews for washing machine, fridge, AC, microwave, and dishwasher repair.",
  keywords: [
    "FixCare Service Center reviews",
    "appliance repair review Jammu",
    "customer feedback",
  ],
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Customer Reviews - FixCare Service Center",
    description:
      "4.8-star average rating from 9 verified reviews across the Jammu region.",
    url: `${SITE.domain}/reviews`,
    type: "website",
  },
};

interface Review {
  name: string;
  location: string;
  service: string;
  rating: number;
  date: string;
  body: string;
}

function parseReviews(markdown: string): Review[] {
  const cleaned = markdown
    .replace(/^#\s+.+$/m, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n---\n[\s\S]*$/, "")
    .trim();

  // Cut everything before "## Customer Reviews"
  const reviewsSectionMatch = cleaned.match(
    /##\s*Customer Reviews[\s\S]*$/i
  );
  const reviewsSection = reviewsSectionMatch ? reviewsSectionMatch[0] : cleaned;

  // Drop trailing "## Leave a Review" section
  const leaveIdx = reviewsSection.search(/^##\s*Leave a Review/im);
  const body = leaveIdx >= 0 ? reviewsSection.slice(0, leaveIdx) : reviewsSection;

  // Split on H3 (### Name - Location)
  const parts = body.split(/^###\s+(.+)$/m);
  const reviews: Review[] = [];
  // parts[0] is text before first review, then pairs (heading, body)
  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].trim();
    const rest = parts[i + 1] ?? "";
    const [name, location] = heading.split(/\s+-\s+|\s+-\s+/).map((s) => s.trim());
    if (!name) continue;

    const serviceMatch = rest.match(/\*\*Service:\*\*\s*(.+)/);
    const ratingMatch = rest.match(/\*\*Rating:\*\*\s*([★☆]+|\d+)/);
    const dateMatch = rest.match(/\*\*Date:\*\*\s*(.+)/);

    // Count filled stars in rating string
    let rating = 5;
    if (ratingMatch) {
      const r = ratingMatch[1];
      if (r.includes("★")) {
        rating = (r.match(/★/g) || []).length;
      } else {
        const n = parseInt(r, 10);
        if (!Number.isNaN(n)) rating = n;
      }
    }

    // Body = everything after the metadata lines
    const bodyText = rest
      .split("\n")
      .filter((l) => !l.startsWith("**") && l.trim().length > 0)
      .join(" ")
      .trim();

    reviews.push({
      name,
      location: location || "Verified customer",
      service: serviceMatch ? serviceMatch[1].trim() : "Appliance repair",
      rating,
      date: dateMatch ? dateMatch[1].trim() : "",
      body: bodyText,
    });
  }
  return reviews;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5 text-accent"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="size-4"
          fill={i < rating ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { frontmatter, content } = readContentBySlug("brand-pages", slug);
  const reviews = parseReviews(content);
  const ratingSum = reviews.reduce((s, r) => s + r.rating, 0);
  const avg = reviews.length ? (ratingSum / reviews.length).toFixed(1) : "0";

  const aggregateSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FixCare Service Center",
    url: SITE.domain,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg,
      reviewCount: String(reviews.length),
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.date,
      description: r.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: r.body,
      itemReviewed: {
        "@type": "Service",
        name: r.service,
        provider: { "@type": "Organization", name: "FixCare Service Center" },
      },
    })),
  };

  return (
    <div>
      <PageHero
        eyebrow="FixCare · Customer Reviews"
        title={frontmatter.title
          .replace(/\s+-\s+.*$/, "")
          .replace(/\s+\|\s+.*$/, "")}
        subtitle={frontmatter.meta_description}
      />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Aggregate rating card */}
        <Card className="bg-card">
          <CardContent className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Aggregate Rating
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  {avg}
                </span>
                <span className="text-sm text-muted-foreground">
                  out of 5 stars
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Stars rating={Math.round(Number(avg))} />
                <p className="text-sm text-muted-foreground">
                  based on{" "}
                  <strong className="text-primary">{reviews.length} verified reviews</strong>{" "}
                  from customers across the Jammu region.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
              <Button asChild>
                <a
                  href={SITE.reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Star className="size-4" aria-hidden="true" />
                  Leave a Review on Google
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={SITE.whatsappLink(
                    "Hi FixCare, I want to share feedback"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  WhatsApp Us Your Feedback
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Intro */}
        <p className="mt-8 text-base leading-relaxed text-muted-foreground">
          At FixCare Service Center, our reputation in the Jammu region has been
          built one repair at a time - through polite, certified technicians who
          arrive when promised, transparent pricing, and written warranties that
          we actually honor. Below are {reviews.length} verified reviews from
          households across the region, covering washing machines, refrigerators,
          air conditioners, microwaves and more.
        </p>

        {/* Review grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {reviews.map((r) => (
            <Card key={`${r.name}-${r.date}`} className="bg-card">
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.location}</p>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <div className="text-xs">
                  <p className="text-accent font-medium">{r.service}</p>
                  <p className="text-muted-foreground">{r.date}</p>
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground">
                  &ldquo;{r.body}&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leave a review CTA */}
        <Card className="mt-10 bg-gradient-to-br from-primary to-accent text-primary-foreground border-0">
          <CardContent className="flex flex-col gap-4 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Leave a Review
              </h2>
              <p className="mt-2 max-w-xl text-primary-foreground/85">
                If FixCare has repaired an appliance in your home, we&apos;d love
                to hear about your experience. Your feedback helps other families
                in the Jammu region choose a reliable repair service, and it
                helps us keep improving.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <a href={SITE.reviewUrl} target="_blank" rel="noopener noreferrer">
                <Star className="size-4" aria-hidden="true" />
                Leave a Review on Google
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>

      <CTASection
        title="Ready to Become Our Next 5-Star Review?"
        subtitle="Book a repair now and experience the same honest, certified, on-time service our reviewers write about."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateSchema) }}
      />
    </div>
  );
}
