import { getMysteryGame, getPublicGames } from "@/lib/printables";
import prisma from "@/lib/prisma";

// Mock de Prisma
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

    describe("getMysteryGame", () => {
        it("retourne le mystère s'il existe et est encore valide", async () => {
            const now = new Date();
            const myst = { id: "1", isMystery: true, mysteryUntil: new Date(now.getTime() + 3600 * 1000) };
            (prisma.printableGame.findFirst as jest.Mock).mockResolvedValue(myst);
            const res = await getMysteryGame();
            expect(res).toBe(myst);
        });

        it("retourne null si aucun mystère n'est valide", async () => {
            (prisma.printableGame.findFirst as jest.Mock).mockResolvedValue(null);
            const res = await getMysteryGame();
            expect(res).toBeNull();
        });
    });

    // 2️⃣ **Tests pour `getPublicGames`**
    describe("getPublicGames", () => {
        it("retourne la liste brute des jeux publics (hors mystère actif)", async () => {
            const now = new Date();
            const data = [
                { id: "1", isMystery: false, mysteryUntil: null },
                { id: "2", isMystery: true, mysteryUntil: new Date(now.getTime() - 24 * 3600 * 1000) }, // Mystère révélé
            ];
            (prisma.printableGame.findMany as jest.Mock).mockResolvedValue(data);
            const res = await getPublicGames();
            expect(res).toEqual(data);
        });

        it("retourne [] si aucun jeu public", async () => {
            (prisma.printableGame.findMany as jest.Mock).mockResolvedValue([]);
            const res = await getPublicGames();
            expect(res).toEqual([]);
        });
    });
});
