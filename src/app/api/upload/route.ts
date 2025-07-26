// app/api/upload/route.ts
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { writeFile, unlink } from "fs/promises";
import { withAdminGuard } from "@/lib/auth.guard";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
    return withAdminGuard(req, async () => {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
            return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
        }

        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];
        if (!allowed.includes(file.type)) {
            return NextResponse.json({ error: "Type non autorisé" }, { status: 400 });
        }

        const maxSize = file.type === "application/pdf"
            ? 10 * 1024 * 1024
            : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: "Fichier trop volumineux" }, { status: 400 });
        }

        const safeName = file.name.replace(/[^a-z0-9.\-_\.\s]/gi, "_");
        const fileName = `${Date.now()}-${safeName}`;
        const target = path.join(process.cwd(), "public/uploads", fileName);

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(target, buffer);

        return NextResponse.json(
            file.type === "application/pdf"
                ? { pdfUrl: `/uploads/${fileName}` }
                : { imageUrl: `/uploads/${fileName}` },
            { status: 200 }
        );
    });
}

export async function DELETE(req: NextRequest) {
    return withAdminGuard(req, async () => {
        const url = new URL(req.url);
        const fileName = url.searchParams.get("file");
        if (!fileName) {
            return NextResponse.json({ error: "Aucun fichier spécifié" }, { status: 400 });
        }
        if (!/^[a-zA-Z0-9.\-_]+$/.test(fileName)) {
            return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
        }
        const filePath = path.join(process.cwd(), "public/uploads", fileName);
        try {
            await unlink(filePath);
            return NextResponse.json({ message: "Fichier supprimé" }, { status: 200 });
        } catch {
            return NextResponse.json({ error: "Impossible de supprimer" }, { status: 500 });
        }
    });
}
