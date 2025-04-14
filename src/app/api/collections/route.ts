import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/utils";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

// 👉 GET : toutes les collections
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const module = searchParams.get("module");

    const collections = await prisma.collection.findMany({
        where: module === "trivium" || module === "quadrivium" ? { module } : undefined,
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            module: true, // ajoute-le pour que le client sache à quoi il a affaire
        },
    });

    return NextResponse.json(collections);
}


// 👉 POST : créer une collection
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const title = body.title?.trim();
        const slug = body.slug || generateSlug(title);
        const module = body.module;

        if (!title) {
            return NextResponse.json({ error: "Titre requis" }, { status: 400 });
        }

        if (module !== "trivium" && module !== "quadrivium") {
            return NextResponse.json({ error: "Module invalide" }, { status: 400 });
        }

        const existing = await prisma.collection.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ error: "Slug déjà utilisé" }, { status: 409 });
        }

        const collection = await prisma.collection.create({
            data: {
                id: new ObjectId().toHexString(),
                title,
                slug,
                description: "",
                module, // 🔥 essentiel pour filtrer correctement après
            },
        });

        return NextResponse.json(collection);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
