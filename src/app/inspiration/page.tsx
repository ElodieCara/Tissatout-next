import { getInspirationData } from "@/lib/server";
import prisma from "@/lib/prisma";
import InspirationPage from "./InspirationPage"; // 👈 Client Component

export default async function Page() {
    const { articles, ideas, advices } = await getInspirationData();

    const settings = await prisma.siteSettings.findFirst();
    const inspirationBanner = settings?.ideasBanner || "/assets/slide3.png";
    const inspirationTitle = settings?.ideasTitle || "💡 Inspiration & Conseils";
    const inspirationDesc =
        settings?.ideasDesc ||
        "Trouvez des idées d’activités et des conseils adaptés à chaque saison et moment clé du développement !";

    return (
        <InspirationPage
            articles={articles}
            ideas={ideas}
            advices={advices}
            inspirationBanner={inspirationBanner}
            inspirationTitle={inspirationTitle}
            inspirationDesc={inspirationDesc}
        />
    );
}