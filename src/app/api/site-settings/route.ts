import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 🔧 Nettoyage des données à mettre à jour : supprime `id` et évite les nulls
function sanitizeUpdateData(data: Record<string, any>) {
    const cleaned: Record<string, string> = {};

    for (const [key, value] of Object.entries(data)) {
        if (key === "id") continue; // ⛔ Ne jamais modifier l'ID
        cleaned[key] = typeof value === "string" && value !== null ? value : "";
    }

    return cleaned;
}

// 🔵 GET: récupérer ou créer les settings
export async function GET() {
    try {
        let settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    homeBanners: [],
                    homeTitle: "",
                    homeDesc: "",
                    universBanner: "",
                    universTitle: "",
                    universDesc: "",
                    coloringBanner: "",
                    coloringTitle: "",
                    coloringDesc: "",
                    adviceBanner: "",
                    adviceTitle: "",
                    adviceDesc: "",
                    ideasBanner: "",
                    ideasTitle: "",
                    ideasDesc: "",
                    agePageBanner: "",
                    agePageTitle: "",
                    agePageDesc: "",
                    newsBanner: "",
                    newsTitle: "",
                    newsDesc: "",
                    contenusBanner: "",
                    contenusTitle: "",
                    contenusDesc: "",
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("❌ Erreur GET SiteSettings", error);
        return NextResponse.json({ error: "Erreur serveur GET" }, { status: 500 });
    }
}

// 🔴 PUT : mise à jour des settings
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const cleanedBody = sanitizeUpdateData(body);

        const settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            const created = await prisma.siteSettings.create({
                data: cleanedBody as unknown as Prisma.SiteSettingsCreateInput,
            });
            return NextResponse.json(created);
        }

        const updated = await prisma.siteSettings.update({
            where: { id: settings.id },
            data: cleanedBody,
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("❌ Erreur PUT SiteSettings", error);
        return NextResponse.json({ error: "Erreur serveur PUT" }, { status: 500 });
    }
}
