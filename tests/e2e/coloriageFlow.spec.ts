import { test, expect } from "@playwright/test";

test("Le visiteur peut imprimer un coloriage", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Coloriages");
    await page.click(".coloriage-card:first-child");
    await expect(page.locator("button", { hasText: "Imprimer" })).toBeVisible();
});
