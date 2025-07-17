import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAdminGuard } from "@/lib/auth.guard";
import { ObjectId } from "mongodb";
import { generateSlug } from "@/lib/utils";

const prisma = new PrismaClient();

/**
 * GET: Récupérer tous les dessins
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const sort = searchParams.get("sort");
        const limit = parseInt(searchParams.get("limit") || "1000", 10);

        console.log("📢 Requête API - Catégorie demandée :", category);

        const drawings = await prisma.drawing.findMany({
            where: category ? { category: { name: { equals: category, mode: "insensitive" } } } : {},
            include: {
                category: { select: { name: true } },
                ageCategories: { include: { ageCategory: true } }, // ✅ Inclure les catégories d'âge
            },
            orderBy: sort === "likes" ? { likes: "desc" } : { views: "desc" },
            take: limit,
        });

        return NextResponse.json(drawings);
    } catch (error) {
        console.error("❌ GET drawings error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🔵 POST — Admin uniquement
export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const { title, imageUrl, categoryId, ageCategories, description } = await req.json();

            if (!title || !imageUrl || !categoryId) {
                return NextResponse.json(
                    { error: "title, imageUrl, categoryId sont requis" },
                    { status: 400 }
                );
            }

            if (!ObjectId.isValid(categoryId)) {
                return NextResponse.json({ error: "categoryId invalide" }, { status: 400 });
            }

            const cat = await prisma.drawingCategory.findUnique({ where: { id: categoryId } });
            if (!cat) {
                return NextResponse.json(
                    { error: "La catégorie spécifiée n'existe pas" },
                    { status: 400 }
                );
            }

            // Vérifier que les catégories d'âge existent
            let ageCategoriesData = [];
            if (ageCategories && Array.isArray(ageCategories)) {
                ageCategoriesData = await prisma.ageCategory.findMany({
                    where: { id: { in: ageCategories } }
                });

                if (ageCategoriesData.length !== ageCategories.length) {
                    return NextResponse.json({ error: "Certaines catégories d'âge n'existent pas" }, { status: 400 });
                }
            }

            // 🔍 Génération d'un slug unique avec UUID
            let slug = generateSlug(title, crypto.randomUUID());
            let exists = await prisma.drawing.findUnique({ where: { slug } });

            while (exists) {
                slug = generateSlug(title, crypto.randomUUID());
                exists = await prisma.drawing.findUnique({ where: { slug } });
            }
            // Création du coloriage
            const newDrawing = await prisma.drawing.create({
                data: {
                    title,
                    imageUrl,
                    categoryId,
                    slug,
                    description,
                    ageCategories: {
                        create: ageCategories.map((ageId: string) => ({
                            ageCategory: { connect: { id: ageId } }
                        }))
                    }
                },
                include: { ageCategories: true } // ✅ Inclure les relations après création
            });

            return NextResponse.json(newDrawing, { status: 201 });
        } catch (error) {
            console.error("❌ POST drawing error:", error);
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
}

// 🟡 PUT — Admin uniquement
export async function PUT(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const { id, title, imageUrl, categoryId, ageCategories, description } = await req.json();

            if (!id || !title || !imageUrl || !categoryId) {
                return NextResponse.json(
                    { error: "Tous les champs sont requis" },
                    { status: 400 }
                );
            }

            if (!ObjectId.isValid(id) || !ObjectId.isValid(categoryId)) {
                return NextResponse.json({ error: "ID invalide" }, { status: 400 });
            }

            // Vérifier si le coloriage existe
            const existingDrawing = await prisma.drawing.findUnique({ where: { id } });
            if (!existingDrawing) {
                return NextResponse.json({ error: "Coloriage non trouvé" }, { status: 404 });
            }

            // Vérifier les catégories d'âge
            let ageCategoriesData = [];
            if (ageCategories && Array.isArray(ageCategories)) {
                ageCategoriesData = await prisma.ageCategory.findMany({
                    where: { id: { in: ageCategories } }
                });

                if (ageCategoriesData.length !== ageCategories.length) {
                    return NextResponse.json({ error: "Certaines catégories d'âge n'existent pas" }, { status: 400 });
                }
            }

            // Mise à jour du coloriage
            const updatedDrawing = await prisma.drawing.update({
                where: { id },
                data: {
                    title,
                    imageUrl,
                    categoryId,
                    slug: title !== existingDrawing.title ? generateSlug(title, crypto.randomUUID()) : existingDrawing.slug,
                    ageCategories: {
                        deleteMany: {}, // 🔥 Supprime les relations existantes
                        create: ageCategories.map((ageId: string) => ({
                            ageCategory: { connect: { id: ageId } }
                        }))
                    },
                    description,
                },
                include: { ageCategories: true }
            });

            return NextResponse.json(updatedDrawing);
        } catch (error) {
            console.error("❌ PUT drawing error:", error);
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
}
