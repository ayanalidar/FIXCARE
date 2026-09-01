import { BlogArticle, buildBlogMetadata } from "@/components/site/blog-article";
import { readContentBySlug } from "@/lib/content";

const slug = "why-is-my-washing-machine-not-draining";

export async function generateMetadata() {
  const { frontmatter } = readContentBySlug("blog", slug);
  return buildBlogMetadata(frontmatter, slug);
}

export default function Page() {
  return <BlogArticle slug={slug} icon="WashingMachine" />;
}
