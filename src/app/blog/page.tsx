import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { Card, CardContent } from "@/components/ui/card";
import { readContent } from "@/lib/content";
import { SITE, BLOG_POSTS } from "@/lib/site";
import { Icon } from "@/components/site/icon";
import { ArrowRight, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Appliance Repair Blog - Tips for Jammu Households | FixCare",
  description:
    "Practical, Jammu-focused appliance repair and maintenance tips from FixCare Service Center. Drainage, cooling, AC error codes, microwave care and more - written for everyday homes.",
  keywords: [
    "appliance repair blog Jammu",
    "washing machine tips",
    "AC maintenance",
    "fridge troubleshooting",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "FixCare Blog - Appliance Repair Tips for Jammu Households",
    description:
      "Practical, Jammu-focused appliance repair and maintenance tips.",
    url: `${SITE.domain}/blog`,
    type: "website",
  },
};

export default function BlogHub() {
  // Read the topic ideas file for the topic ideas section
  const { content: topicsContent } = readContent("blog/blog-topic-ideas.md");
  // Strip H1, comments, and trailing footer
  const topicsBody = topicsContent
    .replace(/^#\s+.+$/m, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n---\n[\s\S]*$/, "")
    .trim();

  return (
    <div>
      <PageHero
        eyebrow="FixCare · Blog"
        title="Appliance Repair Tips for Jammu Households"
        subtitle="Plain-English guides on keeping your washing machine, refrigerator, AC, microwave and more running smoothly through Jammu's long, hot summers and festive seasons - written by the FixCare team."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Latest Articles
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          We publish fresh articles every few weeks. Each one is written
          specifically for homes in the Jammu region - covering the appliances,
          water conditions, and seasonal patterns unique to the area.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Card key={post.slug} className="bg-card transition-shadow hover:shadow-md">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon name={post.icon} className="size-5" aria-hidden="true" />
                  </span>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {post.date}
                  </p>
                </div>
                <h3 className="text-lg font-semibold leading-tight text-primary">
                  <Link href={post.href} className="hover:text-accent">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  href={post.href}
                  className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-primary"
                >
                  Read article
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Topic ideas section */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Lightbulb className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                12 Topic Ideas on Our Editorial Calendar
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A peek at the topics we&apos;re working on next. Want us to
                prioritize one? Let us know on WhatsApp.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-border bg-background p-6">
            <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {topicsBody
                .split(/^##\s+(.+)$/m)
                .filter((part, idx) => idx % 2 === 1)
                .map((title, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-foreground">{title.trim()}</span>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </section>

      <CTASection
        title="Have a Specific Appliance Question?"
        subtitle="If you'd rather skip the reading and just get your appliance fixed, our certified technicians are ready - same-day in Jammu city, next-day across the rest of the Jammu region."
      />
    </div>
  );
}
