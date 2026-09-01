import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(
  process.cwd(),
  "download",
  "wecare-website-overhaul",
  "content"
);

export interface PageFrontmatter {
  title: string;
  meta_description?: string;
  description?: string;
  slug?: string;
  target_keywords?: string[];
  keywords?: string[];
  schema?: string[];
}

export interface ParsedContent {
  frontmatter: PageFrontmatter;
  content: string;
}

/**
 * Reads a markdown file from the FixCare content directory and parses its
 * frontmatter + body. Always runs on the server (build time or request time).
 */
export function readContent(
  relativePath: string
): ParsedContent {
  const fullPath = path.join(CONTENT_ROOT, relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as PageFrontmatter,
    content,
  };
}

/**
 * Helper to safely read content by section + slug.
 * e.g. readContentBySlug("service-pages", "washing-machine-repair")
 */
export function readContentBySlug(
  section: string,
  slug: string
): ParsedContent {
  return readContent(path.join(section, `${slug}.md`));
}

/**
 * Strip leading markdown heading markers from a string for use as a plain
 * title (used for breadcrumbs etc.)
 */
export function stripMarkdownHeading(text: string): string {
  return text.replace(/^#+\s*/, "").trim();
}
