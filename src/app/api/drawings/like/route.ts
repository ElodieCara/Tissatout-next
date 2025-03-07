import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: "ID du coloriage requis" });
    }

    try {
        const updatedDrawing = await prisma.drawing.update({
            where: { id },
            data: { likes: { increment: 1 } }, // ✅ Correction ici
        });

        return res.status(200).json(updatedDrawing);
    } catch (error) {
        console.error("❌ Erreur lors du like :", error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}
