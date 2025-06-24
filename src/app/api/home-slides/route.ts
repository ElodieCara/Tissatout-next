import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminGuard } from "@/lib/auth.guard";

// 🔵 GET : Récupère les slides d’accueil
export async function GET() {
    try {
        const slides = await prisma.homeSlide.findMany({
            orderBy: { order: "asc" }
        });
        return NextResponse.json(slides);
    } catch (error) {
        console.error("❌ Erreur GET home-slides:", error);
        return NextResponse.json({ error: "Erreur serveur GET" }, { status: 500 });
    }
}

// 🟡 POST : Ajoute un nouveau slide
export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const body = await req.json();
            const newSlide = await prisma.homeSlide.create({
                data: {
                    imageUrl: body.imageUrl,
                    title: body.title || "",
                    description: body.description || "",
                    buttonText: body.buttonText || "",
                    buttonLink: body.buttonLink || "",
                    order: body.order || 0,
                },
            });
            return NextResponse.json(newSlide);
        } catch (error) {
            console.error("❌ Erreur POST home-slides:", error);
            return NextResponse.json({ error: "Erreur serveur POST" }, { status: 500 });
        }
    });
}

// 🟠 PUT : Met à jour un slide existant
export async function PUT(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const body = await req.json();

            // ✅ Vérifie que l'id est présent
            if (!body.id) {
                return NextResponse.json({ error: "ID manquant pour la mise à jour" }, { status: 400 });
            }

            const updatedSlide = await prisma.homeSlide.update({
                where: { id: body.id },
                data: {
                    imageUrl: body.imageUrl,
                    title: body.title || "",
                    description: body.description || "",
                    buttonText: body.buttonText || "",
                    buttonLink: body.buttonLink || "",
                    order: body.order || 0,
                },
            });

            return NextResponse.json(updatedSlide);
        } catch (error) {
            console.error("❌ Erreur PUT home-slides:", error);
            return NextResponse.json({ error: "Erreur serveur PUT" }, { status: 500 });
        }
    });
}

// 🔴 DELETE : Supprime un slide
export async function DELETE(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const body = await req.json();
            await prisma.homeSlide.delete({
                where: { id: body.id },
            });
            return NextResponse.json({ success: true });
        } catch (error) {
            console.error("❌ Erreur DELETE home-slides:", error);
            return NextResponse.json({ error: "Erreur serveur DELETE" }, { status: 500 });
        }
    });
}
