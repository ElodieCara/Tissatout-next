"use client";

import { useState } from "react";
import type { Lesson } from "@/types/lessons";
import Banner from "@/components/Banner/Banner";
import CategoryTabs from "@/components/Trivium/CategoryTabs";
import AgeFilter from "@/components/Trivium/AgeFilter";
import TriviumSection from "@/components/Trivium/TriviumSection";
import TriviumSidebar from "@/components/Trivium/SidebarSommaire";
import CollectionBanner from "@/components/Trivium/CollectionBanner";

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
    const categories =
        module === "trivium"
            ? [
                { key: "Grammaire", label: "📖 Grammaire" },
                { key: "Logique", label: "🧠 Logique" },
                { key: "Rhétorique", label: "🗣️ Rhétorique" },
            ]
            : [
                { key: "Arithmétique", label: "➕ Arithmétique" },
                { key: "Géométrie", label: "📐 Géométrie" },
                { key: "Musique", label: "🎵 Musique" },
                { key: "Astronomie", label: "🌌 Astronomie" },
            ];

    const [selectedCategory, setSelectedCategory] = useState(categories[0].key);
    const [selectedAge, setSelectedAge] = useState<string | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<string | undefined>(undefined);

    const filteredByCollection = selectedCollection
        ? lessons.filter(
            (l) => l.collection?.id === selectedCollection && l.collection?.module === module
        )
        : lessons.filter((l) => l.collection?.module === module);

    const filteredLessons = filteredByCollection.filter((lesson) => {
        return (
            lesson.category === selectedCategory &&
            (!selectedAge || lesson.ageTag === selectedAge)
        );
    });

    const ages = Array.from(
        new Set(lessons.map((l) => l.ageTag).filter((a): a is string => !!a))
    );

    return (
        <main className="trivium-page">
            <Banner
                src={`/assets/slide-${module}.png`}
                title={module === "trivium" ? "🎓 Le Trivium pour les Petits Curieux" : "🌌 Le Quadrivium pour les Explorateurs"}
                description={
                    module === "trivium"
                        ? "Découvre des activités amusantes pour apprendre à bien parler, réfléchir et t’exprimer."
                        : "Explore les mystères des nombres, des formes, des sons et des étoiles avec le Quadrivium."
                }
                buttons={[]}
            />

            <div className="trivium-page__layout">
                <div className="trivium-page__main">
                    <CategoryTabs
                        selected={selectedCategory}
                        onChange={setSelectedCategory}
                        categories={categories}
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
                        id={selectedCategory.toLowerCase()}
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
        </main>
    );
}
