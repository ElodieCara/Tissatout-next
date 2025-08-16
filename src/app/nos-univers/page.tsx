// app/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import prisma from "@/lib/prisma";
import NosUnivers from "./NosUnivers";

export const metadata = {
    title: "Nos Univers ✨ | Tissatout",
    description: "Explorez les activités du Trivium et Quadrivium, classées par âge et centres d’intérêt. Pour apprendre, réfléchir et s’amuser !",
    openGraph: {
        title: "Nos Univers ✨ | Tissatout",
        description: "Découvrez le Trivium, le Quadrivium, et des activités pour tous les âges sur Tissatout.",
        url: "https://tissatout.fr/nos-univers",
        type: "website",
        images: ["/assets/univers-banner.jpg"], // remplace si tu as un visuel dédié
    },
    twitter: {
        card: "summary_large_image",
        title: "Nos Univers ✨ | Tissatout",
        description: "Découvrez le Trivium, le Quadrivium, et des activités pour tous les âges sur Tissatout.",
        images: ["/assets/univers-banner.jpg"],
    },
    alternates: {
        canonical: "https://tissatout.fr/nos-univers",
    },
};

export default async function Page() {
    const settings = await prisma.siteSettings.findFirst();
    const mystery = await prisma.printableGame.findFirst({
        where: { isMystery: true },
    });

    return (
        <NosUnivers
            settings={{
                universBanner: settings?.universBanner || "/default-univers.jpg",
                universTitle: settings?.universTitle || "🌟 Nos Univers",
                universDesc: settings?.universDesc || "Découvrez des activités éducatives pour tous les âges !"
            }}
            mystery={mystery}
        />
    );
}
