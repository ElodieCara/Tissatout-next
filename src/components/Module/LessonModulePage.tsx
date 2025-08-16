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
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import BackToTop from "../BackToTop/BackToTop";

interface LessonModulePageProps {
    module: "trivium" | "quadrivium";
    lessons: Lesson[];
    collections: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        lessonsCount: number;
    }[];
}

export default function LessonModulePage({ module, lessons, collections }: LessonModulePageProps) {
    const searchParams = useSearchParams();
    const categories =
        module === "trivium"
            ? [
                { key: "Toutes", label: "Toutes" },
                { key: "Grammaire", label: "Grammaire" },
                { key: "Logique", label: "Logique" },
                { key: "Rhétorique", label: "Rhétorique" },
            ]
            : [
                { key: "Toutes", label: "Toutes" },
                { key: "Arithmétique", label: "Arithmétique" },
                { key: "Géométrie", label: "Géométrie" },
                { key: "Musique", label: "Musique" },
                { key: "Astronomie", label: "Astronomie" },
            ];


    const [selectedCategory, setSelectedCategory] = useState(categories[0].key);
    const [selectedAge, setSelectedAge] = useState<string | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!searchParams) return;
        const categoryFromQuery = searchParams.get("category");

        if (categoryFromQuery && categories.some(c => c.key === categoryFromQuery)) {
            setSelectedCategory(categoryFromQuery);
        }
        // fait réagir l'effet quand l'URL change
    }, [searchParams?.toString()]);

    const filteredByCollection = selectedCollection
        ? lessons.filter(
            (l) => l.collection?.id === selectedCollection && l.collection?.module === module
        )
        : lessons.filter((l) => l.collection?.module === module);

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
            <header className="trivium-banner"
            >
                <Banner
                    src={`/assets/slide-${module}.png`}
                    title={module === "trivium" ? "🎓 Le Trivium pour les Petits Curieux" : "Le Quadrivium pour les Explorateurs"}
                    description={
                        module === "trivium"
                            ? "Découvre des activités amusantes pour apprendre à bien parler, réfléchir et t’exprimer."
                            : "Explore les mystères des nombres, des formes, des sons et des étoiles avec le Quadrivium."
                    }
                    buttons={[]}
                />
            </header>
            <main className="trivium-page">
                <BackToTop />
                <Breadcrumb crumbs={[
                    { label: "Accueil", href: "/" },
                    { label: module === "trivium" ? "Trivium" : "Quadrivium", href: `/${module}` },
                    { label: selectedCategory === "Toutes" ? "Toutes les catégories" : selectedCategory }
                ]} />
                <h1>{module === "trivium" ? "Trivium" : "Quadrivium"}</h1>
                <p>
                    {module === "trivium"
                        ? "Apprendre à raisonner, s'exprimer et comprendre dès le plus jeune âge."
                        : "Explorer les secrets des mathématiques, de la musique, de la géométrie et des étoiles."}
                </p>

                <div className="trivium-page__layout">
                    <div className="trivium-page__main">
                        <CategoryTabs
                            selected={selectedCategory}
                            onChange={setSelectedCategory}
                            categories={categories}
                            module={module}
                        />

                        <AgeFilter
                            selectedAge={selectedAge}
                            ages={ages}
                            onChange={setSelectedAge}
                        />

                        {selectedCollection && (
                            <CollectionBanner
                                title={collections.find((c) => c.id === selectedCollection)?.title || ""}
                                count={filteredByCollection.length}
                                onClear={() => setSelectedCollection(undefined)}
                            />
                        )}

                        <TriviumSection
                            id={selectedCategory === "Toutes" ? "toutes-categories" : selectedCategory.toLowerCase()}
                            title={selectedCategory}
                            lessons={filteredLessons}
                        />

                    </div>

                    <div className="trivium-page__right">
                        <TriviumSidebar
                            collections={collections}
                            selectedId={selectedCollection}
                            onSelect={setSelectedCollection}
                            module={module}
                        />
                    </div>
                </div>
                <div className="trivium-page__footer">
                    <h2>Quadrivium : Comprendre l’univers par les nombres, les formes, la musique et les astres</h2>
                    <p>
                        Le Quadrivium réunit Arithmétique, Géométrie, Musique et Astronomie pour explorer le monde à travers les lois qui l’ordonnent.
                        Cette méthode ancestrale, au cœur de l’éducation classique, éveille l’esprit à la beauté cachée dans le rythme, l’harmonie et la structure.
                        Une porte d’entrée vers les sciences, la logique et la contemplation du réel.
                    </p>
                </div>
            </main>
        </>
    );
}
