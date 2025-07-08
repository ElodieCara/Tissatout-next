import { test, expect } from "@playwright/test";

test("Visiteur imprime un coloriage depuis l’explorer", async ({ page }) => {
    // 1️⃣ Va directement sur l'explorer
    await page.goto("/coloriages/explorer");
    await page.waitForLoadState("networkidle");

    // 2️⃣ Liste des cartes
    const cards = page.locator('.drawing-card, [data-testid="drawing-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // 3️⃣ Clique sur la première carte
    await cards.nth(0).click();

    // 4️⃣ Attendre la navigation vers /coloriages/:slug
    await page.waitForURL(/\/coloriages\/[^/]+$/);

    // 5️⃣ Repérer et attendre le bouton "Imprimer"
    const printButton = page.locator('button:has-text("Imprimer")');
    await printButton.waitFor({ state: "visible", timeout: 10000 });
    await expect(printButton).toBeVisible();
});
