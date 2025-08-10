// app/api/upload/route.ts
import { NextResponse, NextRequest } from "next/server";
import { withAdminGuard } from "@/lib/auth.guard";
import cloudinary from "@/lib/cloudinary";
import path from "path";
import { unlink } from "fs/promises";


export const config = { api: { bodyParser: false } };

// petit helper pour uploader via un stream
function uploadBufferToCloudinary(buffer: Buffer, opts: Record<string, any>) {
    return new Promise<import("cloudinary").UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(opts, (err, result) => {
            if (err || !result) return reject(err);
            resolve(result);
        });
        stream.end(buffer);
    });
}

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

        const maxSize = file.type === "application/pdf" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: "Fichier trop volumineux" }, { status: 400 });
        }

        // lis le fichier
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // nom « safe » pour Cloudinary
        const originalName = (file as any).name || "file";
        const safeName = originalName.replace(/[^a-z0-9.\-_\s]/gi, "_");

        // dossier Cloudinary
        // (tu peux changer le dossier si tu veux séparer images et pdf)
        const baseOptions = {
            folder: "tissatout/uploads",
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            filename_override: safeName,
        };

        // images -> resource_type: "image", PDF -> "raw" (ou "auto" si tu préfères)
        const resourceOptions =
            file.type === "application/pdf" ? { resource_type: "raw" } : { resource_type: "image" };

        try {
            const result = await uploadBufferToCloudinary(buffer, {
                ...baseOptions,
                ...resourceOptions,
            });

            // On renvoie le même shape qu’avant pour ne rien casser côté admin
            if (file.type === "application/pdf") {
                return NextResponse.json({ pdfUrl: result.secure_url }, { status: 200 });
            }
            return NextResponse.json({ imageUrl: result.secure_url }, { status: 200 });
        } catch (e) {
            console.error("Upload Cloudinary error:", e);
            return NextResponse.json({ error: "Échec de l'upload" }, { status: 500 });
        }
    });
}

// tu peux laisser ton DELETE actuel (local) pour le moment
// on fera plus tard un DELETE Cloudinary si tu veux (avec public_id)


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
