import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  images: {
    // Configuration pour autoriser les images de Cloudinary
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // autorise tous les chemins Cloudinary
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/sitemap",
      },
    ];
  },
  // images: {
  //   domains: ["res.cloudinary.com"],
  // },
};

export default nextConfig;
