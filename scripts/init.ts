import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoriesData = {
    "Saisons et Fêtes": ["Hiver", "Printemps", "Été", "Automne", "Noël", "Halloween", "Pâques"],
    "Thèmes": ["Animaux", "Véhicules", "Espace", "Pirates"],
    "Âge": ["Tout Petits (0-3 ans)", "Dès 3 ans", "Dès 6 ans", "Dès 10 ans"],
    "Éducatif & Trivium": ["Mathématiques", "Sciences", "Histoire", "Arts"]
};

async function initCategories() {
    try {
        console.log("🔍 Vérification des sections existantes...");
        const existingSections = await prisma.categorySection.findMany();

        if (existingSections.length > 0) {
            console.log("✅ Les sections existent déjà, annulation.");
            return;
        }

        console.log("⚡ Création des sections et sous-catégories...");

        for (const [sectionName, subcategories] of Object.entries(categoriesData)) {
            // 1️⃣ Créer une **section** (CategorySection)
            const section = await prisma.categorySection.create({
                data: {
                    name: sectionName,
                    description: `Section pour ${sectionName}`,
                    iconSrc: null,
                },
            });

            console.log(`✅ Section créée : ${section.name}`);

            // 2️⃣ Ajouter les **sous-catégories** associées
            for (const subName of subcategories) {
                const subCategory = await prisma.drawingCategory.create({
                    data: {
                        name: subName,
                        sectionId: section.id, // Relie la sous-catégorie à la section
                        parentId: null, // Pas de parent, ce sont des catégories principales
                    },
                });
                console.log(`➡️ Sous-catégorie créée : ${subCategory.name} sous ${sectionName}`);
            }
        }

        console.log("🎉 Catégories et sous-catégories insérées avec succès !");
    } catch (error) {
        console.error("❌ Erreur d'initialisation :", error);
    } finally {
        await prisma.$disconnect();
    }
}

initCategories();
