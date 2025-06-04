"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Lesson } from "@/types/lessons";
import Banner from "@/components/Banner/Banner";
import CategoryTabs from "@/components/Trivium/CategoryTabs";
import AgeFilter from "@/components/Trivium/AgeFilter";
import TriviumSection from "@/components/Trivium/TriviumSection";
import TriviumSidebar from "@/components/Trivium/SidebarSommaire";
import CollectionBanner from "@/components/Trivium/CollectionBanner";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

interface TriviumPageProps {
    lessons: Lesson[];
    collections: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        lessonsCount: number;
        module: "trivium" | "quadrivium";
    }[];
}

export default function TriviumPage({ lessons, collections }: TriviumPageProps) {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState("Grammaire");
    const [selectedAge, setSelectedAge] = useState<string | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<string | undefined>(undefined);
    const activeCollection = collections.find((col) => col.id === selectedCollection);
    const sectionTitle =
        activeCollection
            ? activeCollection.title
            : selectedCategory === "Toutes"
                ? "Toutes les catégories"
                : selectedCategory;
    const pathname = usePathname();
    const module = (pathname ?? "").includes("quadrivium") ? "quadrivium" : "trivium";
    const filteredCollections = collections.filter(c => (c.module ?? "trivium") === module);

    // 🔄 Écouteur pour le changement de l'URL
    useEffect(() => {
        const categoryFromQuery = searchParams?.get("category");

        if (categoryFromQuery) {
            const validCategories = [
                "Toutes", "Grammaire", "Logique", "Rhétorique",
                "Arithmétique", "Géométrie", "Musique", "Astronomie"
            ];

            if (validCategories.includes(categoryFromQuery)) {
                setSelectedCategory(categoryFromQuery);
            } else {
                console.warn("🚫 Catégorie inconnue dans l'URL :", categoryFromQuery);
            }
        } else {
            // 🧺 Si aucune catégorie, on remet "Toutes" par défaut
            setSelectedCategory("Toutes");
        }
    }, [searchParams]);


    const filteredByCollection = selectedCollection
        ? lessons.filter((l) => l.collection?.id === selectedCollection)
        : lessons;

    const filteredLessons = filteredByCollection.filter((lesson) => {
        return (
            (selectedCategory === "Toutes" || lesson.category === selectedCategory) &&
            (!selectedAge || lesson.ageTag === selectedAge)
        );
    });


    const ages = Array.from(
        new Set(lessons.map((l) => l.ageTag).filter((a): a is string => !!a))
    );

    return (
        <>
            <header className="trivium-banner">
                <Banner
                    src="/assets/slide-trivium.png"
                    title="Le Trivium pour les Petits Curieux"
                    description="Découvre des activités amusantes pour apprendre à bien parler, réfléchir et t’exprimer. Grammaire, Logique, Rhétorique… comme les grands penseurs !"
                    buttons={[]}
                />
            </header>

            <main className="trivium-page">
                <Breadcrumb crumbs={[
                    { label: "Accueil", href: "/" },
                    { label: "Trivium", href: "/trivium" },
                    { label: selectedCategory }
                ]} />
                <h1>Le Trivium : Apprendre à penser avec clarté, logique et justesse</h1>
                <p>Découvrez la méthode du Trivium — Grammaire, Logique, Rhétorique — pour apprendre à structurer sa pensée, à raisonner avec rigueur et à s’exprimer avec force.
                    Un socle intemporel pour développer l’intelligence critique et la maîtrise du langage.</p>
                <div className="trivium-page__layout">
                    <div className="trivium-page__main">
                        <CategoryTabs
                            selected={selectedCategory}
                            onChange={setSelectedCategory}
                            categories={[
                                { key: "Toutes", label: "Toutes" },
                                { key: "Grammaire", label: "Grammaire" },
                                { key: "Logique", label: "Logique" },
                                { key: "Rhétorique", label: "Rhétorique" },
                            ]}
                            module={module}
                        />

                        <AgeFilter
                            selectedAge={selectedAge}
                            ages={ages}
                            onChange={setSelectedAge}
                        />

                        <div className="trivium-page__selection">
                            <div className="trivium-page__group">
                                {selectedCollection && (
                                    <CollectionBanner
                                        title={
                                            collections.find((col) => col.id === selectedCollection)?.title || ""
                                        }
                                        count={filteredByCollection.length}
                                        onClear={() => setSelectedCollection(undefined)}
                                    />
                                )}
                                <TriviumSection
                                    id={selectedCategory.toLowerCase()}
                                    title={sectionTitle}
                                    lessons={filteredLessons}
                                />
                            </div>
                            <div className="trivium-page__right">
                                <TriviumSidebar
                                    collections={filteredCollections}
                                    selectedId={selectedCollection}
                                    onSelect={setSelectedCollection}
                                    module={module}
                                />

                            </div>
                        </div>
                        <div className="trivium-page__footer">
                            <h2>Pourquoi le Trivium ?</h2>
                            <p> Parce qu’il ne suffit pas de savoir. Il faut comprendre, discerner et transmettre.
                                Le Trivium — Grammaire, Logique, Rhétorique — n’est pas une méthode scolaire parmi d’autres.
                                C’est un chemin. Celui qui mène de la simple réception à la pensée articulée.
                                Apprendre selon le Trivium, c’est retrouver un ordre naturel : d’abord nommer le monde avec justesse (grammaire),
                                puis apprendre à y voir clair, à trier, à relier (logique),
                                enfin oser dire, défendre, convaincre (rhétorique).
                                Dans un monde saturé d’images et d’opinions, cette structure donne des racines.
                                Elle apprend à penser avant de parler, à écouter avant de répondre, à formuler sans manipuler.
                                C’est une école de liberté intérieure — exigeante, patiente, mais profondément libératrice.</p>
                        </div>
                    </div>
                </div>
            </main>
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "EducationalOccupationalProgram",
                        name: "Trivium",
                        description:
                            "Explore le Trivium pour enfants : Grammaire, Logique et Rhétorique à travers des leçons claires, illustrées et inspirantes.",
                        educationalLevel: "Primary",
                        provider: {
                            "@type": "Organization",
                            name: "Tissatout",
                            url: "https://tissatout.fr",
                        },
                        image: "https://tissatout.fr/trivium-og.jpg",
                        url: "https://tissatout.fr/trivium",
                    }),
                }}
            />
        </>
    );
}
