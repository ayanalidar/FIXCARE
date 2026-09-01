import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { MarkdownContent } from "@/components/site/markdown-content";
import { readContentBySlug, type PageFrontmatter } from "@/lib/content";
import { SITE } from "@/lib/site";

export function buildContentMetadata(
  fm: PageFrontmatter,
  slug: string
): Metadata {
  return {
    title: fm.title,
    description: fm.meta_description,
    keywords: fm.target_keywords,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: fm.title,
      description: fm.meta_description,
      url: `${SITE.domain}/${slug}`,
      type: "article",
    },
  };
}

interface ContentPageOptions {
  /** section under /content/, e.g. "brand-pages" or "legal-pages" */
  section: string;
  /** file slug (no .md) */
  slug: string;
  /** Route slug used for canonical URL, e.g. "about" - defaults to slug */
  urlSlug?: string;
  /** Page hero eyebrow text */
  eyebrow?: string;
  /** Whether to render the bottom CTA */
  withCta?: boolean;
  /** Override CTA title */
  ctaTitle?: string;
  /** Override CTA subtitle */
  ctaSubtitle?: string;
  /** Optional: render any extra children at the top of the body (e.g. schema) */
  topChildren?: React.ReactNode;
}

export function ContentPage({
  section,
  slug,
  urlSlug,
  eyebrow,
  withCta = true,
  ctaTitle,
  ctaSubtitle,
  topChildren,
}: ContentPageOptions) {
  const { frontmatter, content } = readContentBySlug(section, slug);

  const cleanedBody = content
    .replace(/^#\s+.+$/m, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n---\n[\s\S]*$/, "")
    .trim();

  return (
    <div>
      <PageHero
        eyebrow={eyebrow}
        title={frontmatter.title.replace(/\s+-\s+.*$/, "").replace(/\s+\|\s+.*$/, "")}
        subtitle={frontmatter.meta_description}
      />
      {topChildren}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <MarkdownContent content={cleanedBody} />
      </article>
      {withCta && (
        <CTASection
          title={ctaTitle}
          subtitle={ctaSubtitle}
          variant={withCta ? "default" : "narrow"}
        />
      )}
    </div>
  );
}
