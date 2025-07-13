// tests/e2e/printablesApi.spec.ts
import { test, expect } from '@playwright/test';

test.describe("API PrintableGame - Debug", () => {
    test.beforeAll(async () => {
        console.log('Setup terminé - données mockées prêtes');
    });

    test.afterAll(async () => {
        console.log('Nettoyage terminé');
    });

    test("Vérifier que l'API existe", async ({ request }) => {
        // Test simple pour voir si l'endpoint existe
        const response = await request.get('/api/printable/test');
        console.log('API existence check status:', response.status());

        if (response.status() === 404) {
            console.log('❌ L\'API /api/printable/[id] n\'existe pas encore');
        } else {
            console.log('✅ L\'API /api/printable/[id] existe');
        }
    });

    test("GET /api/printable/[id] retourne la fiche - DEBUG", async ({ request }) => {
        // Utilisez un ObjectId MongoDB valide (24 caractères hexadécimaux)
        const testId = "507f1f77bcf86cd799439011"; // Exemple d'ObjectId valide

        const response = await request.get(`/api/printable/${testId}`);

        // Debug : afficher le statut et le contenu de la réponse
        console.log('Response status:', response.status());

        if (response.status() === 500) {
            const errorText = await response.text();
            console.log('Error response:', errorText);
        }

        // Même si l'ObjectId n'existe pas, il ne devrait pas y avoir d'erreur 500
        if (response.status() === 200) {
            const data = await response.json();
            console.log('Success response:', data);
            expect(data).toHaveProperty('id');
            expect(data).toHaveProperty('title');
        } else if (response.status() === 404) {
            console.log('✅ ObjectId valide mais donnée non trouvée (comportement normal)');
        } else {
            // Afficher l'erreur pour debugging
            const errorContent = await response.text();
            console.log('Full error response:', errorContent);

            // Fail le test avec plus d'infos
            expect(response.status()).toBe(200);
        }
    });

    test("GET /api/printable/[id] avec ID inexistant - DEBUG", async ({ request }) => {
        // Utilisez un ObjectId MongoDB valide mais qui n'existe pas
        const response = await request.get('/api/printable/507f1f77bcf86cd799439022');

        console.log('Response status for non-existent:', response.status());

        if (response.status() === 500) {
            const errorText = await response.text();
            console.log('Error response for non-existent:', errorText);
        } else if (response.status() === 404) {
            console.log('✅ Comportement correct : 404 pour ObjectId valide mais inexistant');
        }

        // Ce test devrait retourner 404, pas 500
        expect(response.status()).toBe(404);
    });
});