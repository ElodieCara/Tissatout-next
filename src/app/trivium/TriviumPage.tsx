"use client";

import { useState } from "react";
import type { Lesson } from "@/types/lessons";
import Banner from "@/components/Banner/Banner";
import CategoryTabs from "@/components/Trivium/CategoryTabs";
import AgeFilter from "@/components/Trivium/AgeFilter";
import TriviumSection from "@/components/Trivium/TriviumSection";
import TriviumSidebar from "@/components/Trivium/SidebarSommaire";
import CollectionBanner from "@/components/Trivium/CollectionBanner";

interface TriviumPageProps {
    lessons: Lesson[];
    collections: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        lessonsCount: number;
    }[];
}

export default function TriviumPage({ lessons, collections }: TriviumPageProps) {
    const [selectedCategory, setSelectedCategory] = useState("Grammaire");
    const [selectedAge, setSelectedAge] = useState<string | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<string | undefined>(undefined);

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
                    <CategoryTabs selected={selectedCategory} onChange={setSelectedCategory} />
                    <AgeFilter selectedAge={selectedAge} ages={ages} onChange={setSelectedAge} />
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
                        collections={collections}
                        selectedId={selectedCollection}
                        onSelect={setSelectedCollection}
                    />
                </div>
            </div>
        </main>
    );
}
