import prisma from "@/lib/prisma"; // ⚡ Utilise l'instance Prisma existante
import { generateSlug } from "@/lib/utils";

// 🔵 Fonction pour récupérer tous les articles
export async function getArticles() {
    return await prisma.article.findMany({
        select: {
            id: true,
            title: true,
            slug: true, // 🔥 Ajout du slug dans la requête
            content: true,
            image: true,
            description: true,
            date: true,
        },
        orderBy: { date: "desc" },
    });
}

// 🔵 Fonction pour récupérer un article par son slug
export async function getArticleBySlug(slug: string) {
    return await prisma.article.findUnique({
        where: { slug }, // 🔥 Recherche par slug au lieu de l'ID
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            image: true,
            description: true,
            date: true,
        },
    });
}

// 🔵 Ajouter un article avec un slug automatique
export async function createArticle(
    title: string,
    content: string,
    category?: string,
    description?: string,
    image?: string
) {
    // 🔥 Générer un slug dès le début
    let slug = generateSlug(title, Math.random().toString(36).substr(2, 6)); // Ajoute un suffixe aléatoire

    // ✅ Vérifier que le slug est unique
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    // ✅ Créer l'article avec le slug unique dès le départ
    return await prisma.article.create({
        data: {
            title,
            slug: uniqueSlug, // 🔥 Slug obligatoire
            content,
            category,
            description,
            image,
        },
    });
}
