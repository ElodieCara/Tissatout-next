import prisma from "@/lib/prisma"; // ✅ Utilisation de Prisma
import { Drawing } from "@/types/drawing";

/** ✅ Récupère toutes les inspirations */
export async function getInspirationData() {
    const [articlesRes, ideasRes, adviceRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, { next: { revalidate: 60 } }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas`, { next: { revalidate: 60 } }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advice`, { next: { revalidate: 60 } })
    ]);

    if (!articlesRes.ok || !ideasRes.ok || !adviceRes.ok) {
        throw new Error("Erreur lors de la récupération des données.");
    }

    return {
        articles: await articlesRes.json(),
        ideas: await ideasRes.json(),
        advices: await adviceRes.json(),
    };
}

/** ✅ Récupère tous les coloriages */
export async function getDrawings(): Promise<Drawing[]> {
    const drawings = await prisma.drawing.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    console.log("📸 Données récupérées depuis Prisma:", drawings); // 🔍 Vérification

    return drawings.map(d => ({
        id: d.id,
        title: d.title,
        imageUrl: d.imageUrl,
        views: d.views ?? 0,
        likes: d.likes ?? 0,
        category: d.category ? { name: d.category.name } : undefined,
    }));
}


/** ✅ Récupère un coloriage spécifique par son ID */
export async function getDrawingById(id: string): Promise<Drawing | null> {
    console.log("🔍 Recherche du dessin avec l'ID :", id); // Vérifier que l’ID est bien reçu

    try {
        const drawing = await prisma.drawing.findUnique({
            where: { id }, // PAS D'ObjectId ici, juste une chaîne de caractères
        });

        if (!drawing) {
            console.error("❌ Prisma : Aucun dessin trouvé !");
            return null;
        }

        console.log("✅ Prisma a trouvé :", drawing);
        return drawing;
    } catch (error) {
        console.error("❌ Erreur Prisma :", error);
        return null;
    }
}
