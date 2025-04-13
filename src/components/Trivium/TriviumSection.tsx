"use client";

import LessonCard from "./LessonCard";
import type { Lesson } from "@/types/lessons";

interface TriviumSectionProps {
    id: string;
    title: string;
    lessons: Lesson[];
}

export default function TriviumSection({ id, title, lessons }: TriviumSectionProps) {
    return (
        <section id={id} className="trivium-section">
            <h2 className="trivium-section__title">{title}</h2>
            {lessons.length === 0 ? (
                <p className="trivium-section__empty">Pas encore de leçons disponibles.</p>
            ) : (
                <div className="trivium-section__grid">
                    {lessons.map((lesson) => (
                        <LessonCard key={lesson.slug} lesson={lesson} />
                    ))}
                </div>
            )}
        </section>
    );
}
