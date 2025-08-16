export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';


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

    const toISO = (d: unknown) =>
        d instanceof Date ? d.toISOString() : (d as string | undefined) ?? "";

    const safeArticles = articles.map(a => ({
        ...a,
        description: a.description ?? "",
        image: a.image ?? undefined,            // ← null -> undefined
        iconSrc: (a as any).iconSrc ?? undefined,
        category: (a as any).category ?? undefined,
        printableSupport: (a as any).printableSupport ?? undefined,
        author: (a as any).author ?? undefined,
        printableGameId: (a as any).printableGameId ?? undefined,
        date: toISO((a as any).date),
    }));

    const safeIdeas = ideas.map(i => ({
        ...i,
        image: i.image ?? undefined,            // ← null -> undefined
        description: i.description ?? "",
        createdAt: toISO((i as any).createdAt),
        updatedAt: toISO((i as any).updatedAt),
    }));

    const safeAdvices = advices.map(a => ({
        ...a,
        description: a.description ?? "",
        imageUrl: (a as any).imageUrl ?? undefined,
        createdAt: toISO((a as any).createdAt),
        updatedAt: toISO((a as any).updatedAt),
    }));

    const settings = await prisma.siteSettings.findFirst();
    const inspirationBanner = settings?.ideasBanner || "/assets/slide3.png";
    const inspirationTitle = settings?.ideasTitle || "💡 Inspiration & Conseils";
    const inspirationDesc =
        settings?.ideasDesc ||
        "Trouvez des idées d’activités et des conseils adaptés à chaque saison et moment clé du développement !";

    return (
        <InspirationPage
            articles={safeArticles}
            ideas={safeIdeas}
            advices={safeAdvices}
            inspirationBanner={inspirationBanner}
            inspirationTitle={inspirationTitle}
            inspirationDesc={inspirationDesc}
        />
    );
}
