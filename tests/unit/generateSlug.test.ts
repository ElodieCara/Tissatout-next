import { generateSlug } from "@/lib/utils";

describe("generateSlug", () => {
    it("génère un slug unique", () => {
        const slug = generateSlug("Mon Titre Original", "123");
        expect(slug).toContain("mon-titre-original");
        expect(slug).toContain("123");
    });
});
