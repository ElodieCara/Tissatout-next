export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';


import { getCollectionsWithLessons } from "../../lib/lessons";
import LessonModulePage from "./../../components/Module/LessonModulePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quadrivium – Apprendre les sciences et les arts de manière vivante",
    description:
        "Découvre le Quadrivium sur Tissatout : un parcours éducatif fondé sur l'harmonie des nombres, des sons, des formes et des astres.",
    openGraph: {
        title: "Quadrivium – Tissatout",
        description:
            "Une méthode ancienne pour relier l’enfant à l’ordre du monde à travers les arts libéraux : arithmétique, musique, géométrie, astronomie.",
        url: "https://www.tissatout.fr/quadrivium",
        type: "website",
        images: ["/assets/quadrivium-banner.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Quadrivium – Tissatout",
        description:
            "Tissatout réinvente le Quadrivium pour les enfants : comprendre l’univers par la beauté des formes, du son et du calcul.",
        images: ["/assets/quadrivium-banner.jpg"],
    },
};

export default async function QuadriviumPage() {
    const rawCollections = await getCollectionsWithLessons("quadrivium");

    const collections = rawCollections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        slug: collection.slug,
        description: collection.description ?? null,
        lessonsCount: collection.lessons.length,
        lessons: collection.lessons,
    }));

    const lessons = collections.flatMap((c) => c.lessons);

    return (
        <>
            <LessonModulePage
                module="quadrivium"
                collections={collections}
                lessons={lessons}
            />
            <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "EducationalOccupationalProgram",
                    name: "Quadrivium",
                    description:
                        "Une méthode ancienne pour relier l’enfant à l’ordre du monde à travers les arts libéraux : arithmétique, musique, géométrie, astronomie.",
                    educationalLevel: "Primary",
                    provider: {
                        "@type": "Organization",
                        name: "Tissatout",
                        url: "https://www.tissatout.fr",
                    },
                    image: "https://www.tissatout.fr/assets/quadrivium-banner.jpg",
                    url: "https://www.tissatout.fr/quadrivium",
                }),
            }} />
        </>
    );
}
