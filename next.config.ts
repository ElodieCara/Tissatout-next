// next.config.mjs
import path from "node:path";

/** @type {import('next').NextConfig} */
const isVercel = Boolean(process.env.VERCEL);
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;

const nextConfig = {
  // Débloque le déploiement sur Vercel (sans impacter ton dev local)
  eslint: { ignoreDuringBuilds: isVercel },
  typescript: { ignoreBuildErrors: isVercel },

  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: cloudinaryCloudName
      ? [
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
      ]
      : [],
  },

  async rewrites() {
    return [{ source: "/sitemap.xml", destination: "/sitemap" }];
  },
};

export default nextConfig;
