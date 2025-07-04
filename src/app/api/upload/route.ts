import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { withAdminGuard } from "@/lib/auth.guard";

export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const formData = await req.formData();
            const file = formData.get("file") as File | null;

            if (!file) {
                return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
            }

            // ✅ Type autorisé
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!allowedTypes.includes(file.type)) {
                return NextResponse.json({ error: "Type non autorisé" }, { status: 400 });
            }

            // ✅ Taille max
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                return NextResponse.json({ error: "Fichier trop volumineux" }, { status: 400 });
            }

            // ✅ Nom propre
            const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "_");
            const fileName = `${Date.now()}-${safeName}`;
            const filePath = path.join(process.cwd(), "public/uploads", fileName);

            const buffer = Buffer.from(await file.arrayBuffer());
            await writeFile(filePath, buffer);

            return NextResponse.json({ imageUrl: `/uploads/${fileName}` }, { status: 200 });
        } catch (err) {
            console.error(err);
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
}

export async function DELETE(req: NextRequest) {
    return withAdminGuard(req, async () => {
        const { searchParams } = new URL(req.url);
        const fileName = searchParams.get("file");

        if (!fileName) {
            return NextResponse.json({ error: "Aucun fichier spécifié" }, { status: 400 });
        }

        if (!/^[a-zA-Z0-9.\-_]+$/.test(fileName)) {
            return NextResponse.json({ error: "Nom de fichier invalide" }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public/uploads", fileName);

        try {
            await unlink(filePath);
            return NextResponse.json({ message: "Fichier supprimé" }, { status: 200 });
        } catch (err) {
            console.error("Erreur delete:", err);
            return NextResponse.json({ error: "Impossible de supprimer" }, { status: 500 });
        }
    });
}