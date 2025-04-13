import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/utils";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

// 👉 GET : toutes les collections
export async function GET() {
    const collections = await prisma.collection.findMany({
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
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

        if (!title) {
            return NextResponse.json({ error: "Titre requis" }, { status: 400 });
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
            },
        });

        return NextResponse.json(collection);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
