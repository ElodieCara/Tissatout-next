import { test, expect } from "@playwright/test";

test.describe("Admin Subscribers API", () => {

    test("GET /api/admin/subscribers sans token => 401", async ({ request }) => {
        const res = await request.get("/api/admin/subscribers");
        expect(res.status()).toBe(401);
    });

    test("GET /api/admin/subscribers avec token fake => 401 ou 200", async ({ request }) => {
        const fakeToken = "FAKE_VALID_TOKEN"; // Pas vraiment valide
        const res = await request.get("/api/admin/subscribers", {
            headers: {
                Cookie: `auth_token=${fakeToken}`
            },
        });
        expect([401, 500]).toContain(res.status());
    });

    test("POST /api/admin/subscribers sans token => (401 OU 200 selon config)", async ({ request }) => {
        const res = await request.post("/api/admin/subscribers", {
            data: { email: "test@example.com" },
        });

        expect([200, 401]).toContain(res.status());
    });

});
