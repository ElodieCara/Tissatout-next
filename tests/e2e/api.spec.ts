import { test, expect } from "@playwright/test";

test.describe("API public routes", () => {
    test("GET /api/drawings renvoie 200 + JSON", async ({ request }) => {
        const res = await request.get("/api/drawings");
        expect(res.status()).toBe(200);
        const data = await res.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });
});

test.describe("API protected routes", () => {
    test("GET /api/protected sans token => 401", async ({ request }) => {
        const res = await request.get("/api/protected");
        expect(res.status()).toBe(401);
    });

    test("GET /api/protected avec token fake => 401", async ({ request }) => {
        const fakeToken = "FAKE_VALID_TOKEN";
        const res = await request.get("/api/protected", {
            headers: {
                cookie: `auth_token=${fakeToken}`,
            },
        });
        expect(res.status()).toBe(401);
    });
});
