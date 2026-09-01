import type { MetadataRoute } from "next";
import { SITE, SERVICES, LOCATIONS, BLOG_POSTS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.domain}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.domain}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.domain}/locations`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.domain}/book-repair`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE.domain}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE.domain}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.domain}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.domain}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE.domain}/brands`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.domain}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.domain}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.domain}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.domain}/warranty-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${SITE.domain}${s.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const locationRoutes: MetadataRoute.Sitemap = LOCATIONS.map((l) => ({
    url: `${SITE.domain}${l.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${SITE.domain}${p.href}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...locationRoutes, ...blogRoutes];
}
