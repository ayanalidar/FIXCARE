import { ContentPage, buildContentMetadata } from "@/components/site/content-page";
import { readContentBySlug } from "@/lib/content";

const slug = "privacy-policy";

export async function generateMetadata() {
  const { frontmatter } = readContentBySlug("legal-pages", slug);
  return buildContentMetadata(frontmatter, "privacy-policy");
}

export default function Page() {
  return (
    <ContentPage
      section="legal-pages"
      slug={slug}
      urlSlug="privacy-policy"
      eyebrow="WeCare · Legal"
      withCta={false}
    />
  );
}
