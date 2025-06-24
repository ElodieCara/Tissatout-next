import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminGuard } from "@/lib/auth.guard";

export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const settings = await prisma.siteSettings.findFirst({
                select: { id: true },
            });

            if (!settings) {
                return NextResponse.json({ error: "Aucun document SiteSettings trouvé." }, { status: 404 });
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
                },
            });

            return NextResponse.json({ message: "✅ Données réparées avec succès", fixedSettings });
        } catch (error: any) {
            console.error("❌ Erreur dans /api/site-settings/fix :", error);
            return NextResponse.json({ error: "Erreur de réparation", detail: error.message }, { status: 500 });
        }
    });
}
