import { test, expect } from "@playwright/test";

test.describe("Page détail d'un coloriage", () => {
    test("Le visiteur voit le bouton Imprimer sur la page détail", async ({ page }) => {
        await page.goto("/coloriages/mon-premier-nuage-a-colorier");
        await page.waitForLoadState("networkidle");

        // Vérifier le titre
        await expect(
            page.locator("h1", { hasText: "Mon premier nuage à colorier" })
        ).toBeVisible();

        // Vérifier le format des vues (quel que soit le nombre)
        await expect(page.locator(".drawing-page__views"))
            .toHaveText(/^👀\s*\d+\s*vues$/);

        // Vérifier le bouton Imprimer
        const printButton = page.locator('button:has-text("Imprimer")');
        await printButton.waitFor({ state: "visible", timeout: 10000 });

        // Confirmer l'ouverture de la popup d'impression
        const [popup] = await Promise.all([
            page.waitForEvent("popup"),
            printButton.click(),
        ]);
        await expect(popup).not.toBeNull();
    });
});
