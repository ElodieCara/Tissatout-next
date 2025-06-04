import TriviumPage from "./TriviumPage";
import { getTriviumLessons, getTriviumCollections } from "@/lib/lessons";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Trivium | Apprendre à penser comme les Anciens",
    description:
        "Explore le Trivium pour enfants : Grammaire, Logique et Rhétorique à travers des leçons claires, illustrées et inspirantes.",
    openGraph: {
        title: "Trivium | Apprendre à penser comme les Anciens",
        description:
            "Explore le Trivium pour enfants : Grammaire, Logique et Rhétorique à travers des leçons claires, illustrées et inspirantes.",
        url: "https://tissatout.fr/trivium",
        siteName: "Tissatout",
        locale: "fr_FR",
        type: "website",
        images: ["https://tissatout.fr/trivium-og.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Trivium | Apprendre à penser comme les Anciens",
        description:
            "Explore le Trivium pour enfants : Grammaire, Logique et Rhétorique à travers des leçons claires, illustrées et inspirantes.",
        images: ["https://tissatout.fr/trivium-og.jpg"],
    },
    alternates: {
        canonical: "https://tissatout.fr/trivium",
    },
};

export default async function Page() {
    const lessons = await getTriviumLessons();
    const collections = await getTriviumCollections();

    return <TriviumPage lessons={lessons} collections={collections} />;
}
