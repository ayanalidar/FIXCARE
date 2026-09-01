import { ServicePage, buildServiceMetadata } from "@/components/site/service-page";
import { readContentBySlug } from "@/lib/content";

const slug = "air-conditioner-repair";

export async function generateMetadata() {
  const { frontmatter } = readContentBySlug("service-pages", slug);
  return buildServiceMetadata(frontmatter, slug);
}

export default function Page() {
  return <ServicePage slug={slug} icon="Wind" shortName="Air Conditioner" />;
}
