import { ContentPage, buildContentMetadata } from "@/components/site/content-page";
import { readContentBySlug } from "@/lib/content";

const slug = "warranty-policy";

export async function generateMetadata() {
  const { frontmatter } = readContentBySlug("legal-pages", slug);
  return buildContentMetadata(frontmatter, "warranty-policy");
}

export default function Page() {
  return (
    <ContentPage
      section="legal-pages"
      slug={slug}
      urlSlug="warranty-policy"
      eyebrow="FixCare · Legal"
      withCta={true}
      ctaTitle="Need to Make a Warranty Claim?"
      ctaSubtitle="If a problem we repaired has recurred within the warranty period, call or WhatsApp us with your warranty reference number and we'll schedule a priority visit - no visit fee, no labour charge, and no charge for the same replacement part."
    />
  );
}
