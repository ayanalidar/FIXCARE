import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel auto-detects Next.js — no need for output: "standalone" on Vercel.
  // Remove standalone mode which is for self-hosted Docker-style deployments.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip lint during build on Vercel (we run lint separately in dev)
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    // Allow local images in /public — no remote domains needed for now
    // Add remote patterns here if needed in the future
    remotePatterns: [],
  },
};

export default nextConfig;
