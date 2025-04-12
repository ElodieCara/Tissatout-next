"use client";

import Image from "next/image";
import Markdown from "react-markdown";
import type { Lesson } from "@/types/lessons";

export default function LessonPage({ lesson }: { lesson: Lesson }) {
    return (
        <article className="lesson">
            <header className="lesson__header">
                <h1 className="lesson__title">{lesson.title}</h1>
                {lesson.ageTag && <span className="lesson__age">📍 {lesson.ageTag}</span>}
                {lesson.image && (
                    <div className="lesson__image">
                        <Image
                            src={lesson.image}
                            alt={lesson.title}
                            width={800}
                            height={400}
                            className="lesson__img"
                        />
                    </div>
                )}
                {lesson.summary && <p className="lesson__summary">{lesson.summary}</p>}
            </header>

            <section className="lesson__content">
                <Markdown>{lesson.content}</Markdown>
            </section>
        </article>
    );
}
