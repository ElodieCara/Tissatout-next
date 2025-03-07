import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { ObjectId } from "mongodb"

const prisma = new PrismaClient()

/**
 * GET: Récupérer tous les dessins
 * Inclure la catégorie pour chaque dessin
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const sort = searchParams.get("sort");
        const limit = parseInt(searchParams.get("limit") || "1000", 10);

        const drawings = await prisma.drawing.findMany({
            where: category ? { category: { name: category } } : {},
            include: {
                category: true,
            },
            orderBy: sort === "likes" ? { likes: "desc" } : { createdAt: "desc" },
            take: limit,
        });

        return NextResponse.json(drawings);
    } catch (error) {
        console.error("❌ GET drawings error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

/**
 * POST: Créer un nouveau dessin
 * - title
 * - imageUrl
 * - categoryId (doit exister)
 */
export async function POST(req: Request) {
    try {
        const { title, imageUrl, categoryId } = await req.json()

        if (!title || !imageUrl || !categoryId) {
            return NextResponse.json(
                { error: "title, imageUrl, categoryId sont requis" },
                { status: 400 },
            )
        }

        // Vérif categoryId
        if (!ObjectId.isValid(categoryId)) {
            return NextResponse.json({ error: "categoryId invalide" }, { status: 400 })
        }

        const cat = await prisma.drawingCategory.findUnique({
            where: { id: categoryId },
        })
        if (!cat) {
            return NextResponse.json(
                { error: "La catégorie spécifiée n'existe pas" },
                { status: 400 },
            )
        }

        // Création
        const newDrawing = await prisma.drawing.create({
            data: {
                title,
                imageUrl,
                categoryId,
            },
        })

        return NextResponse.json(newDrawing, { status: 201 })
    } catch (error) {
        console.error("❌ POST drawing error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
