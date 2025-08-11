import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: { includePaths: [path.join(__dirname, "src/styles")] },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/**`,
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/image/fetch/**`,
      },
    ],
  },
  async rewrites() {
    return [{ source: "/sitemap.xml", destination: "/sitemap" }];
  },
};

export default nextConfig;
