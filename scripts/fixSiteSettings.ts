import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixSiteSettings() {
    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
        console.log("Aucun settings trouvé.");
        return;
    }

    const cleaned = Object.fromEntries(
        Object.entries(settings).map(([key, value]) => {
            if (typeof value === "string" || value instanceof Date) return [key, value];
            return [key, ""]; // Remplace tous les nulls par ""
        })
    );

    await prisma.siteSettings.update({
        where: { id: settings.id },
        data: cleaned,
    });

    console.log("✅ Données nettoyées avec succès.");
}

fixSiteSettings()
    .catch((e) => {
        console.error("❌ Erreur durant la réparation :", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
