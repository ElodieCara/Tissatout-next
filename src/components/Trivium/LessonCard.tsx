"use client";

import Image from "next/image";
import Link from "next/link";
import type { Lesson } from "@/types/lessons";
import LessonStatusBadge from "./LessonsStatusBadge";

export default function LessonCard({ lesson }: { lesson: Lesson }) {
    return (
        <Link href={`/trivium/${lesson.slug}`} className="lesson-card">
            <div className="lesson-card__status">
                <LessonStatusBadge slug={lesson.slug} />
            </div>
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
                {lesson.ageTag && (
                    <p className="lesson-card__age">📍 {lesson.ageTag}</p>
                )}
                <p className="lesson-card__summary">
                    {lesson.summary || "Une leçon à découvrir !"}
                </p>
            </div>
        </Link>
    );
}
