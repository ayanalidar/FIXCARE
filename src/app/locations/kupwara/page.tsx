import { LocationPage, buildLocationMetadata } from "@/components/site/location-page";
import { readContentBySlug } from "@/lib/content";
import { LOCATIONS } from "@/lib/site";

const slug = "kupwara";

export async function generateMetadata() {
  const { frontmatter } = readContentBySlug("location-pages", slug);
  return buildLocationMetadata(frontmatter, slug);
}

export default function Page() {
  const location = LOCATIONS.find((l) => l.slug === slug)!;
  return <LocationPage location={location} />;
}
