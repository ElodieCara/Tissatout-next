import prisma from "@/lib/prisma";
import { getPrintableBySlug } from "@/lib/printables";

jest.mock("@/lib/prisma", () => ({
    __esModule: true,
    default: {
        printableGame: {
            findFirst: jest.fn(),
        },
    },
}));

describe("getPrintableBySlug — cas limites", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("retourne null si slug vide", async () => {
        (prisma.printableGame.findFirst as jest.Mock).mockResolvedValue(null);
        const result = await getPrintableBySlug("");
        expect(result).toBeNull();
    });

    it("retourne null si slug undefined", async () => {
        (prisma.printableGame.findFirst as jest.Mock).mockResolvedValue(null);
        // @ts-expect-error: on teste le undefined exprès
        const result = await getPrintableBySlug(undefined);
        expect(result).toBeNull();
    });

    it("retourne null si printable non trouvé", async () => {
        (prisma.printableGame.findFirst as jest.Mock).mockResolvedValue(null);
        const result = await getPrintableBySlug("inconnu");
        expect(result).toBeNull();
    });

    it("accepte un printable sans thèmes ni types", async () => {
        const fake = {
            id: "X",
            slug: "test",
            title: "Test",
            imageUrl: "/img.png",
            ageMin: 5,
            ageMax: 7,
            themes: undefined,
            types: undefined,
            extraImages: [],
            pdfUrl: null,
            pdfPrice: null,
            printUrl: null,
            printPrice: null,
            description: "desc",
            isMystery: false,
            mysteryUntil: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            views: 0,
            isFeatured: false,
        };
        (prisma.printableGame.findFirst as jest.Mock).mockResolvedValue(fake);
        const res = await getPrintableBySlug("test");
        expect(res).toMatchObject({ slug: "test", title: "Test" });
    });

    it("accepte un printable avec themes/types vides", async () => {
        const fake = {
            id: "X",
            slug: "vide",
            title: "Vide",
            imageUrl: "/img.png",
            ageMin: 1,
            ageMax: 2,
            themes: [],
            types: [],
            extraImages: [],
            pdfUrl: null,
            pdfPrice: null,
            printUrl: null,
            printPrice: null,
            description: "",
            isMystery: false,
            mysteryUntil: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            views: 0,
            isFeatured: false,
        };
        (prisma.printableGame.findFirst as jest.Mock).mockResolvedValue(fake);
        const res = await getPrintableBySlug("vide");
        expect(res).toMatchObject({ slug: "vide" });
    });

    it("accepte un printable mystère avec mysteryUntil dans le futur", async () => {
        const fake = {
            id: "X",
            slug: "mystere",
            title: "Mystère",
            imageUrl: "/img.png",
            ageMin: 4,
            ageMax: 9,
            themes: [],
            types: [],
            extraImages: [],
            pdfUrl: null,
            pdfPrice: null,
            printUrl: null,
            printPrice: null,
            description: "Une surprise",
            isMystery: true,
            mysteryUntil: new Date(Date.now() + 3 * 24 * 3600 * 1000), // dans 3 jours
            createdAt: new Date(),
            updatedAt: new Date(),
            views: 0,
            isFeatured: false,
        };
        (prisma.printableGame.findFirst as jest.Mock).mockResolvedValue(fake);
        const res = await getPrintableBySlug("mystere");
        expect(res).toMatchObject({ slug: "mystere", isMystery: true });
    });
});
