import { ServicePage, buildServiceMetadata } from "@/components/site/service-page";
import { readContentBySlug } from "@/lib/content";

const slug = "water-dispenser-repair";

export async function generateMetadata() {
  const { frontmatter } = readContentBySlug("service-pages", slug);
  return buildServiceMetadata(frontmatter, slug);
}

export default function Page() {
  return <ServicePage slug={slug} icon="Droplet" shortName="Water Dispenser" />;
}
