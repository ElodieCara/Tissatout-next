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

    const troisAns = await prisma.ageCategory.upsert({
        where: { slug: "3-ans" },
        update: {},
        create: {
            title: "3 ans",
            slug: "3-ans",
            description: "Activités adaptées aux enfants de 3 ans.",
            imageCard: "/images/3-ans-card.jpg",
            imageBanner: "/images/3-ans-banner.jpg",
        }
    });

    console.log("✅ Catégorie ajoutée :", troisAns);

    const sixAns = await prisma.ageCategory.upsert({
        where: { slug: "6-ans" },
        update: {},
        create: {
            title: "6 ans",
            slug: "6-ans",
            description: "Activités pour les enfants de 6 ans.",
            imageCard: "/images/6-ans-card.jpg",
            imageBanner: "/images/6-ans-banner.jpg",
        }
    });

    console.log("✅ Catégorie ajoutée :", sixAns);

    const dixAns = await prisma.ageCategory.upsert({
        where: { slug: "10-ans" },
        update: {},
        create: {
            title: "10 ans",
            slug: "10-ans",
            description: "Activités pour les enfants de 10 ans.",
            imageCard: "/images/10-ans-card.jpg",
            imageBanner: "/images/10-ans-banner.jpg",
        }
    });

    console.log("✅ Catégorie ajoutée :", dixAns);




    // const article = await prisma.article.create({
    //     data: {
    //         title: "Pourquoi la lecture est importante pour les tout-petits",
    //         content: "Lire aux enfants dès le plus jeune âge développe leur vocabulaire...",
    //         slug: "lecture-tout-petits",
    //         category: "lecture",
    //         author: "Tissatout",
    //         ageCategories: { create: { ageCategoryId: toutPetits.id } }
    //     }
    // });

    // console.log("✅ Article ajouté :", article);
}

main()
    .catch((e) => {
        console.error("❌ Erreur :", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
