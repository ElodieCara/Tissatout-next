// tests/integration/getDrawings.test.ts

import { getDrawings, getTrendingDrawings } from "@/lib/server";

describe("getDrawings()", () => {
    it("renvoie un tableau de dessins", async () => {
        const drawings = await getDrawings();
        expect(Array.isArray(drawings)).toBe(true);
        expect(drawings.length).toBeGreaterThan(0); // ou pas, selon ta base
    });
});

describe("getTrendingDrawings()", () => {
    it("renvoie les dessins les plus vus", async () => {
        const trending = await getTrendingDrawings();
        expect(Array.isArray(trending)).toBe(true);
        expect(trending.length).toBeGreaterThanOrEqual(0);
    });
});
