"use client";

import { useState } from "react";
import type { Lesson } from "@/types/lessons";
import Banner from "@/components/Banner/Banner";
import CategoryTabs from "@/components/Trivium/CategoryTabs";
import AgeFilter from "@/components/Trivium/AgeFilter";
import TriviumSection from "@/components/Trivium/TriviumSection";
import TriviumSidebar from "@/components/Trivium/SidebarSommaire";
import CollectionBanner from "@/components/Trivium/CollectionBanner";
import { usePathname } from "next/navigation";

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
    const categories = [
        { key: "Grammaire", label: "📖 Grammaire" },
        { key: "Logique", label: "🧠 Logique" },
        { key: "Rhétorique", label: "🗣️ Rhétorique" },
    ];

    const categoryKeys = categories.map(c => c.key);
    const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0]);
    const [selectedAge, setSelectedAge] = useState<string | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<string | undefined>(undefined);
    const pathname = usePathname();
    const module = (pathname ?? "").includes("quadrivium") ? "quadrivium" : "trivium";
    const filteredCollections = collections.filter(c => c.module === module);

    const filteredByCollection = selectedCollection
        ? lessons.filter((l) => l.collection?.id === selectedCollection)
        : lessons;

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
                src="/assets/slide-trivium.png"
                title="🎓 Le Trivium pour les Petits Curieux"
                description="Découvre des activités amusantes pour apprendre à bien parler, réfléchir et t’exprimer. Grammaire, Logique, Rhétorique… comme les grands penseurs !"
                buttons={[]}
            />

            <div className="trivium-page__layout">
                <div className="trivium-page__main">
                    <CategoryTabs
                        selected={selectedCategory}
                        onChange={setSelectedCategory}
                        categories={categories} />

                    <AgeFilter
                        selectedAge={selectedAge}
                        ages={ages}
                        onChange={setSelectedAge}
                    />

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
                        title={selectedCategory}
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
        </main>
    );
}
