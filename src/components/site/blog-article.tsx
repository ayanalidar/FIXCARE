import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { FAQAccordion, type FAQItem } from "@/components/site/faq-accordion";
import { MarkdownContent } from "@/components/site/markdown-content";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { readContentBySlug, type PageFrontmatter } from "@/lib/content";
import { SITE, BLOG_POSTS, type BlogMeta } from "@/lib/site";

export interface BlogArticleInput {
  slug: string;
  icon: string;
}

export function buildBlogMetadata(
  fm: PageFrontmatter,
  slug: string
): Metadata {
  return {
    title: fm.title,
    description: fm.meta_description,
    keywords: fm.target_keywords,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: fm.title,
      description: fm.meta_description,
      url: `${SITE.domain}/blog/${slug}`,
      type: "article",
    },
  };
}

/**
 * Extracts the FAQ Q&A pairs from the markdown body (sections under an "FAQ"
 * H2) and returns them as a structured list.
 */
function extractFAQs(markdown: string): FAQItem[] {
  const faqMatch = markdown.match(
    /##\s*(?:Frequently Asked Questions|FAQ)[\s\S]*?(?=\n##\s|$)/
  );
  if (!faqMatch) return [];
  const section = faqMatch[0];
  const qas: FAQItem[] = [];
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

export function BlogArticle({ slug, icon }: BlogArticleInput) {
  const { frontmatter, content } = readContentBySlug("blog", slug);
  const faqs = extractFAQs(content);

  // Identify the FAQ section and the conclusion to render them separately
  const faqStartMatch = content.match(/^##\s*(?:Frequently Asked Questions|FAQ)/m);
  const faqStart = faqStartMatch ? faqStartMatch.index : content.length;

  // Conclusion = first H2 AFTER the FAQ section (if any), or last H2
  const afterFaq = content.slice(faqStart);
  const conclusionMatch = afterFaq
    .slice(afterFaq.indexOf("\n") + 1)
    .match(/^##\s+(.+)$/m);
  const conclusionStartRel = conclusionMatch
    ? afterFaq.indexOf("\n", afterFaq.indexOf("\n") + 1) +
      (conclusionMatch.index ?? 0)
    : -1;

  // Build the main article body: everything before the FAQ section
  const mainBody = content
    .slice(0, faqStart)
    .replace(/^#\s+.+$/m, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n---\n[\s\S]*$/, "")
    .trim();

  // Conclusion section: from the start of the first H2 after FAQ to the end (minus trailing footer)
  let conclusionBody = "";
  if (conclusionStartRel >= 0) {
    conclusionBody = content
      .slice(faqStart + conclusionStartRel)
      .replace(/\n---\n[\s\S]*$/, "")
      .trim();
  }

  const postMeta = BLOG_POSTS.find((p: BlogMeta) => p.slug === slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.meta_description,
    author: {
      "@type": "Organization",
      name: "FixCare Service Center",
      url: SITE.domain,
    },
    publisher: {
      "@type": "Organization",
      name: "FixCare Service Center",
      url: SITE.domain,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.domain}/logo.svg`,
      },
    },
    mainEntityOfPage: `${SITE.domain}/blog/${slug}`,
    keywords: frontmatter.target_keywords
      ? frontmatter.target_keywords.join(", ")
      : undefined,
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

  // Next/prev articles for nav
  const idx = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? BLOG_POSTS[idx - 1] : null;
  const next = idx < BLOG_POSTS.length - 1 ? BLOG_POSTS[idx + 1] : null;

  return (
    <div>
      <PageHero
        eyebrow="FixCare · Blog"
        title={frontmatter.title}
        subtitle={frontmatter.meta_description}
      />

      <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            {/* Article meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 text-accent" aria-hidden="true" />
                {postMeta?.date ?? "Recent"}
              </span>
              <span aria-hidden="true">·</span>
              <span>By FixCare Service Center</span>
            </div>

            {/* Main body */}
            <div className="mt-6">
              <MarkdownContent content={mainBody} />
            </div>

            {/* FAQ */}
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

            {/* Conclusion */}
            {conclusionBody && (
              <div className="mt-10 rounded-lg border border-accent/30 bg-accent/5 p-6">
                <MarkdownContent content={conclusionBody} />
              </div>
            )}

            {/* Article nav */}
            <nav
              className="mt-12 grid gap-4 border-t border-border pt-6 sm:grid-cols-2"
              aria-label="Article navigation"
            >
              {prev ? (
                <Link
                  href={prev.href}
                  className="group flex items-center gap-2 rounded-lg border border-border bg-card p-4 hover:border-accent"
                >
                  <ArrowLeft className="size-4 shrink-0 text-muted-foreground group-hover:text-accent" aria-hidden="true" />
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Previous
                    </span>
                    <span className="block text-sm font-semibold text-primary group-hover:text-accent">
                      {prev.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={next.href}
                  className="group flex items-center justify-end gap-2 rounded-lg border border-border bg-card p-4 text-right hover:border-accent"
                >
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Next
                    </span>
                    <span className="block text-sm font-semibold text-primary group-hover:text-accent">
                      {next.title}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-accent" aria-hidden="true" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="bg-card sticky top-24">
              <CardContent className="space-y-4 p-6">
                <div>
                  <h3 className="text-base font-semibold text-primary">
                    Need this repair done for you?
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Reading is great — but if your appliance is acting up right
                    now, we can have a certified technician at your door the same
                    day in Jammu city, next-day across the Jammu region.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/book-repair">Book a Repair Online</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href={SITE.whatsappLink(
                        `Hi FixCare, I just read your article on ${frontmatter.title} and I need a repair`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
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
                  More from our blog
                </h3>
                <ul className="space-y-2 text-sm">
                  {BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 5).map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={p.href}
                        className="block rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-primary"
                >
                  All articles →
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </article>

      <CTASection
        title="Skip the Reading, Get the Repair"
        subtitle="If your appliance is already acting up, don't wait for the problem to get worse. Book a repair now — a certified FixCare technician will be at your door the same day in Jammu city, or the next day across the rest of the Jammu region."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
