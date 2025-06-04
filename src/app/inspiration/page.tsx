import { getInspirationData } from "@/lib/server";
import prisma from "@/lib/prisma";
import InspirationPage from "./InspirationPage"; // 👈 Client Component
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Inspiration & Conseils | Tissatout",
    description: "Idées créatives, activités éducatives et conseils pratiques pour accompagner les enfants au fil des saisons.",
    openGraph: {
        title: "Inspiration & Conseils | Tissatout",
        description: "Trouvez des idées et des conseils pour occuper les enfants intelligemment avec des activités adaptées !",
        images: [
            {
                url: "/assets/slide3.png",
                width: 1200,
                height: 630,
                alt: "Inspiration & Conseils",
            },
        ],
    },
};

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