import { ContentPage, buildContentMetadata } from "@/components/site/content-page";
import { readContentBySlug } from "@/lib/content";

const slug = "about-us";

export async function generateMetadata() {
  const { frontmatter } = readContentBySlug("brand-pages", slug);
  return buildContentMetadata(frontmatter, "about");
}

export default function Page() {
  return (
    <ContentPage
      section="brand-pages"
      slug={slug}
      urlSlug="about"
      eyebrow="About FixCare"
      withCta={true}
      ctaTitle="Let's Get Your Appliance Working Again"
      ctaSubtitle="Whether you need a repair today or just want to ask a question, we are one call away."
    />
  );
}
