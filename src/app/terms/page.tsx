import { ContentPage, buildContentMetadata } from "@/components/site/content-page";
import { readContentBySlug } from "@/lib/content";

const slug = "terms-and-conditions";

export async function generateMetadata() {
  const { frontmatter } = readContentBySlug("legal-pages", slug);
  return buildContentMetadata(frontmatter, "terms");
}

export default function Page() {
  return (
    <ContentPage
      section="legal-pages"
      slug={slug}
      urlSlug="terms"
      eyebrow="FixCare · Legal"
      withCta={false}
    />
  );
}
