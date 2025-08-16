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
    const article = await prisma.article.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            image: true,
            description: true,
            date: true,
            author: true,
            iconSrc: true,
            printableSupport: true,
            tags: true,
            ageCategories: {
                select: {
                    ageCategory: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
            },
            sections: {
                select: {
                    title: true,
                    content: true,
                    style: true,
                },
            },
            relatedLinks: {
                select: {
                    toArticle: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            image: true,
                        },
                    },
                },
            },
            printableGame: true,
        },
    });

    if (!article) return null;

    // On extrait les articles liés
    const relatedArticles = article.relatedLinks.map((link) => link.toArticle);

    // On retourne l'article avec une nouvelle propriété 'relatedArticles'
    return {
        ...article,
        relatedArticles,
        sections: article.sections.map((s) => ({
            title: s.title,
            content: s.content,
            style: s.style || "classique",
        })),
    };
}



// 🔵 Ajouter un article avec un slug automatique
export async function createArticle(
    title: string,
    content: string,
    category?: string,
    description?: string,
    image?: string
) {
    // Slug “de base”
    const slug = generateSlug(title, Math.random().toString(36).substr(2, 6));    // Slug qui sera potentiellement modifié pour l’unicité
    let uniqueSlug = slug;

    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter++}`;
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
