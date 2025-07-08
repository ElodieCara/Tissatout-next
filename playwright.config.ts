import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
    },
    webServer: {
        command: "npm run dev",
        port: 3000,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
