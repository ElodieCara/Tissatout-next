import type { NextConfig } from "next";
import path from "path";

const isVercel = !!process.env.VERCEL;
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: isVercel
  },
  typescript: {
    ignoreBuildErrors: isVercel
  },

  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")]
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: cloudinaryCloudName ? [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${cloudinaryCloudName}/image/upload/**`,
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${cloudinaryCloudName}/image/fetch/**`,
      },
    ] : [],
  },

  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/sitemap" }
    ];
  },
};

export default nextConfig;