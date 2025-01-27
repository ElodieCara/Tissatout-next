import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* Autres options de configuration */
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
};

export default nextConfig;
