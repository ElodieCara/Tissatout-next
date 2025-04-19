// scripts/cleanupOrphans.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanup() {
    console.log("🧹 Début du nettoyage des liaisons orphelines...");

    // 🔍 On récupère les GameTheme sans inclure le thème
    const gameThemes = await prisma.gameTheme.findMany();
    const orphanedThemes = [];

    for (const theme of gameThemes) {
        const related = await prisma.gameTheme.findUnique({
            where: { id: theme.id },
            include: { theme: true },
        });

        if (!related?.theme) {
            orphanedThemes.push(theme);
        }
    }

    // 🔍 Pareil pour GameType
    const gameTypes = await prisma.gameType.findMany();
    const orphanedTypes = [];

    for (const type of gameTypes) {
        const related = await prisma.gameType.findUnique({
            where: { id: type.id },
            include: { type: true },
        });

        if (!related?.type) {
            orphanedTypes.push(type);
        }
    }

    console.log(`🎯 Orphaned Themes: ${orphanedThemes.length}`);
    console.log(`🎯 Orphaned Types: ${orphanedTypes.length}`);

    // ❌ Suppression des orphelins
    for (const theme of orphanedThemes) {
        await prisma.gameTheme.delete({ where: { id: theme.id } });
        console.log(`❌ Supprimé GameTheme orphelin : ${theme.id}`);
    }

    for (const type of orphanedTypes) {
        await prisma.gameType.delete({ where: { id: type.id } });
        console.log(`❌ Supprimé GameType orphelin : ${type.id}`);
    }

    console.log("✅ Nettoyage terminé.");
}

cleanup()
    .catch((e) => {
        console.error("💥 Erreur dans le script :", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
