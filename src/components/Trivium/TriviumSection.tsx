"use client";

import { useState } from "react";
import LessonCard from "./LessonCard";
import type { Lesson } from "@/types/lessons";

interface TriviumSectionProps {
    id: string;
    title: string;
    lessons: Lesson[];
}

export default function TriviumSection({ id, title, lessons }: TriviumSectionProps) {
    const [visibleCount, setVisibleCount] = useState(6);
    const visibleLessons = lessons.slice(0, visibleCount);

    return (
        <section id={id} className="trivium-section">
            <h2 className="trivium-section__title">{title}</h2>
            {lessons.length === 0 ? (
                <p className="trivium-section__empty">Pas encore de leçons disponibles.</p>
            ) : (
                <>
                    <div className="trivium-section__grid">
                        {visibleLessons.map((lesson) => (
                            <LessonCard key={lesson.slug} lesson={lesson} />
                        ))}
                    </div>

                    {visibleCount < lessons.length && (
                        <div className="voir-plus-container">
                            <button
                                className="voir-plus-btn"
                                onClick={() => setVisibleCount((prev) => prev + 6)}
                            >
                                Voir plus
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
