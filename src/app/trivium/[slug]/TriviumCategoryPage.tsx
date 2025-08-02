"use client";

import Link from "next/link";
import Image from "next/image";
import type { Lesson } from "@/types/lessons";

const categoryMap: Record<string, string> = {
    grammaire: "Grammaire",
    logique: "Logique",
    rhetorique: "Rhétorique"
};

export default function TriviumCategory({ category, lessons }: { category: string; lessons: Lesson[] }) {
    const displayCategory = categoryMap[category.toLowerCase()] || category;

    return (
        <main className="trivium-category">
            <h1 className="trivium-category__title">📚 Leçons de {displayCategory}</h1>

            {lessons.length === 0 ? (
                <p>Aucune leçon disponible.</p>
            ) : (
                <div className="lesson-list__grid">
                    {lessons.map((lesson) => (
                        <Link
                            key={lesson.slug}
                            href={`/${lesson.module}/${lesson.slug}`}
                            className="lesson-card"
                            aria-label={`Voir la leçon : ${lesson.title}`}
                        >
                            <div className="lesson-card__image">
                                <Image
                                    src={lesson.image || "/placeholder.jpg"}
                                    alt={lesson.title}
                                    width={300}
                                    height={200}
                                />
                            </div>
                            <div className="lesson-card__content">
                                <h4 className="lesson-card__title">{lesson.title}</h4>
                                <p className="lesson-card__summary">
                                    {lesson.summary || "Découvre cette leçon passionnante..."}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="lesson-actions">
                <Link href="/fiches/jeanne-darc.pdf"> Fiche à imprimer</Link>
                {/* <Link href="/quiz/jeanne-darc">Faire le quiz</Link> */}
                <Link href="/illustrations/jeanne-darc"> Voir l’image</Link>
            </div>

        </main>
    );
}
