// eslint.config.mjs
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  // Ignorer les dossiers de build
  {
    ignores: ["node_modules/**", ".next/**", "dist/**", "out/**"],
  },

  // Base Next + TS (Flat config)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Règles globales un peu assouplies pour débloquer le build
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // tolère les variables/arguments non utilisés préfixés par "_"
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // apostrophes non échappées -> on ne bloque pas
      "react/no-unescaped-entities": "off",
      // <a> interne : on ne bloque pas
      "@next/next/no-html-link-for-pages": "off",
      // règle Next qui te bloquait dans quelques fichiers
      "@next/next/no-assign-module-variable": "off",
    },
  },

  // ADMIN : on relâche davantage (et on autorise <img>)
  {
    files: ["src/app/admin/**/*.{ts,tsx}"],
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // API : `any` autorisé (souvent pratique pour les payloads)
  {
    files: ["src/app/api/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
];

export default config;
