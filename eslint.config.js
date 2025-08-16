// eslint.config.js
const { FlatCompat } = require("@eslint/eslintrc");
const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  { ignores: ["node_modules/**", ".next/**", "dist/**", "out/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/app/admin/**/*.{ts,tsx}"],
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
    },
  },
];
