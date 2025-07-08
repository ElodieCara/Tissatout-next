import { generateSlug } from "@/lib/utils";
import { slugify } from "@/lib/slugify";

describe("generateSlug", () => {
    it("génère un slug simple sans ID", () => {
        const result = generateSlug("Mon Titre Mignon avec É accents !");
        expect(result).toBe("mon-titre-mignon-avec-e-accents");
    });

    it("ajoute un ID tronqué si fourni", () => {
        const result = generateSlug("Chat Mystique", "abc123456789");
        expect(result).toBe("chat-mystique-abc123");
    });

    it("tronque le slug à 50 caractères", () => {
        const longTitle = "a".repeat(100);
        const result = generateSlug(longTitle);
        expect(result.length).toBeLessThanOrEqual(50);
    });
});

describe("slugify", () => {
    it("slugifie un texte avec espaces et majuscules", () => {
        const result = slugify("Mon Texte Cool");
        expect(result).toBe("mon-texte-cool");
    });

    it("remplace underscores et nettoie", () => {
        const result = slugify("Hello_World_!!");
        expect(result).toBe("hello-world");
    });

    it("supprime tirets doublons", () => {
        const result = slugify("Hello  --  World");
        expect(result).toBe("hello-world");
    });
});
