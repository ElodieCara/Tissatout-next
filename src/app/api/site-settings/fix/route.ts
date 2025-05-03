import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findFirst({
            select: { id: true }
        });

        if (!settings) {
            return NextResponse.json({ message: "Aucun document SiteSettings trouvé." });
        }

        const fixedSettings = await prisma.siteSettings.update({
            where: { id: settings.id },
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

        return NextResponse.json({ message: "✅ Données réparées avec succès", fixedSettings });
    } catch (error: any) {
        console.error("❌ Erreur dans /api/site-settings/fix :", error);
        return NextResponse.json({ error: "Erreur de réparation", detail: error.message }, { status: 500 });
    }
}
