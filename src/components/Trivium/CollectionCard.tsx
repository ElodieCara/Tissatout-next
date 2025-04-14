"use client";

import Image from "next/image";
import type { Lesson } from "@/types/lessons";
import Link from "next/link";

interface CollectionCardProps {
    title: string;
    description: string;
    image: string;
    slug: string;
    lessons: Lesson[];
}

export default function CollectionCard({ title, description, image, slug, lessons }: CollectionCardProps) {
    return (
        <div className="collection-card" id={slug}>
            <div className="collection-card__header">
                <Image src={image} alt={title} width={80} height={80} className="collection-card__image" />
                <div className="collection-card__infos">
                    <h3 className="collection-card__title">{title}</h3>
                    <p className="collection-card__desc">{description}</p>
                </div>
            </div>

            <div className="collection-card__lessons">
                {lessons.map((lesson) => (
                    <Link href={`/trivium/${lesson.slug}`} key={lesson.slug} className="collection-card__lesson">
                        <span>{lesson.title}</span>
                        {lesson.ageTag && <span className="collection-card__age">📍 {lesson.ageTag}</span>}

                    </Link>
                ))}
            </div>
        </div>
    );
}