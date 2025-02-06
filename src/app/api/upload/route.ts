import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

// 🟢 Gérer l'upload d'image
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
        }

        // 📌 Générer un nom de fichier unique
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(process.cwd(), "public/uploads", fileName);

        // 📌 Convertir `File` en Buffer et l'écrire dans `/public/uploads`
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, fileBuffer);

        // 📌 Retourner le chemin de l'image
        return NextResponse.json({ imageUrl: `/uploads/${fileName}` }, { status: 200 });

    } catch (error) {
        console.error("Erreur lors de l'upload :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
