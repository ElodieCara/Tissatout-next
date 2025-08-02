"use client";

import Image from "next/image";
import Link from "next/link";
import type { Lesson } from "@/types/lessons";
import LessonStatusBadge from "./LessonsStatusBadge";

export default function LessonCard({ lesson }: { lesson: Lesson }) {
    return (
        <Link href={`/${lesson.module}/${lesson.slug}`} className="lesson-card">

            <div className="lesson-card__image-wrapper">
                <Image
                    src={lesson.image || "/placeholder.jpg"}
                    alt={lesson.title}
                    fill
                    className="lesson-card__image"
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="lesson-card__tags">
                    {lesson.ageTag && <span className="tag tag--age">{lesson.ageTag}</span>}
                    <span className={`tag tag--cat tag--${lesson.category.toLowerCase()}`}>{lesson.category}</span>
                </div>
            </div>

            <div className="lesson-card__content">
                <h4 className="lesson-card__title">{lesson.title}</h4>
                <p className="lesson-card__summary">{lesson.summary || "Découvre cette leçon passionnante..."}</p>
            </div>

            <div className="lesson-card__status">
                <LessonStatusBadge slug={lesson.slug} />
            </div>
        </Link>

    );
}
