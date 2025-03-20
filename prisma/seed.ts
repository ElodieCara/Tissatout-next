import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const toutPetits = await prisma.ageCategory.upsert({
        where: { slug: "tout-petits" },
        update: {},
        create: {
            title: "Tout-petits",
            slug: "tout-petits",
            description: "Activités adaptées aux tout-petits.",
            imageCard: "/images/tout-petits-card.jpg",
            imageBanner: "/images/tout-petits-banner.jpg",
        }
    });

    console.log("✅ Catégorie ajoutée :", toutPetits);

    const article = await prisma.article.create({
        data: {
            title: "Pourquoi la lecture est importante pour les tout-petits",
            content: "Lire aux enfants dès le plus jeune âge développe leur vocabulaire...",
            slug: "lecture-tout-petits",
            category: "lecture",
            author: "Tissatout",
            ageCategories: { create: { ageCategoryId: toutPetits.id } }
        }
    });

    console.log("✅ Article ajouté :", article);
}

main()
    .catch((e) => {
        console.error("❌ Erreur :", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
