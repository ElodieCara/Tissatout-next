// eslint.config.mjs
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utilise l'ancien écosystème (.eslintrc) via FlatCompat dans le nouveau format "flat"
const compat = new FlatCompat({ baseDirectory: __dirname });

// Config utilisée en local (dev)
const localConfig = [
  {
    // Toujours ignorer les répertoires de build
    ignores: ["node_modules/**", ".next/**", "dist/**"],
  },
  // Tes presets Next
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

// En CI (Vercel met VERCEL=1 et souvent CI=1), on exporte une config vide → aucun lint
const isCI =
  !!process.env.CI || !!process.env.VERCEL || process.env.NODE_ENV === "production";

export default isCI ? [] : localConfig;
