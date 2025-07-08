// tests/unit/printables.spec.ts
import prisma from "@/lib/prisma";
import { getPrintableBySlug, getSimilarPrintables } from "@/lib/printables";

jest.mock("@/lib/prisma", () => ({
    __esModule: true,
    default: {
        printableGame: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

describe("printables lib", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getPrintableBySlug", () => {
        it("retourne null si aucun printable", async () => {
            (prisma.printableGame.findFirst as jest.Mock).mockResolvedValue(null);
            const result = await getPrintableBySlug("inconnu");
            expect(result).toBeNull();
        });

        it("renvoie le printable et mappe bien les champs", async () => {
            const fake = {
                id: "42",
                slug: "ma-fiche",
                title: "Ma Fiche",
                imageUrl: "/img.png",
                ageMin: 3,
                ageMax: 5,
                themes: [],
                types: [],
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
            const res = await getPrintableBySlug("ma-fiche");
            expect(res).toMatchObject({
                id: "42",
                slug: "ma-fiche",
                title: "Ma Fiche",
                ageMin: 3,
                ageMax: 5,
            });
        });
    });

    describe("getSimilarPrintables", () => {
        it("appelle bien prisma.printableGame.findMany et retourne ses résultats bruts", async () => {
            const sample = [
                { id: "1", isMystery: false, mysteryUntil: null },
                { id: "2", isMystery: true, mysteryUntil: new Date(Date.now() - 86400000) },
                { id: "3", isMystery: true, mysteryUntil: new Date(Date.now() + 86400000) },
            ];
            (prisma.printableGame.findMany as jest.Mock).mockResolvedValue(sample);
            const result = await getSimilarPrintables("42", 3, 6, ["foo", "bar"]);
            // Le filtre des mystères non révélés n’appartient pas à cette fonction selon ton code
            expect(result).toEqual(sample);
            expect(prisma.printableGame.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({ id: { not: "42" } })
            }));
        });
    });
});
