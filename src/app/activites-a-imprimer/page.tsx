export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { Metadata } from "next";
import { getPublicGames } from "@/lib/printables";
import ActivityPrintPage from "./ActivityPrintPage";

export const metadata: Metadata = {
    title: "Activités éducatives à imprimer – Trivium & Quadrivium | Tissatout",
    description:
        "Jeux éducatifs, fiches pédagogiques et activités à imprimer pour enfants dès 3 ans. Inspiré du Trivium et Quadrivium – pour apprendre avec méthode.",
    keywords: [
        "activités éducatives à imprimer",
        "jeux pédagogiques enfants",
        "Trivium Quadrivium",
        "éducation maison",
        "fiches pédagogiques",
        "Tissatout",
        "éducation classique",
        "école à la maison"
    ],
    openGraph: {
        title: "Activités éducatives à imprimer – Tissatout",
        description:
            "Téléchargez ou commandez des fiches éducatives inspirées du Trivium et Quadrivium. Pour un apprentissage rigoureux, dès 3 ans.",
        url: "https://www.tissatout.com/activites-a-imprimer",
        images: [
            {
                url: "/images/banners/printable.jpg",
                width: 1200,
                height: 630,
                alt: "Activités à imprimer - Trivium et Quadrivium"
            }
        ],
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Activités éducatives à imprimer – Tissatout",
        description: "Jeux pédagogiques et fiches à imprimer, dès 3 ans. Trivium & Quadrivium.",
        images: ["/images/banners/printable.jpg"]
    }
};

export default async function Page() {
    const games = await getPublicGames();
    return <ActivityPrintPage games={games} />;
}
