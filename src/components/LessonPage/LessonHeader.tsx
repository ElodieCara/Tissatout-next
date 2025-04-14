import Image from "next/image";
import LessonActions from "./LessonActions";
import Breadcrumb from "./../Breadcrumb/Breadcrumb"; // adapte si besoin


interface LessonHeaderProps {
    title: string;
    slug: string;
    chapterTitle?: string;
    personageName?: string;
    personageDates?: string;
    personageNote?: string;
    ageTag?: string | null;
    image?: string | null;
    summary?: string | null;
}

export default function LessonHeader({
    title,
    slug,
    chapterTitle,
    personageName,
    personageDates,
    personageNote,
    ageTag,
    image,
    summary,
}: LessonHeaderProps) {

    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Trivium", href: "/trivium" },
        { label: chapterTitle || "Leçons" },
        { label: title }
    ];

    return (
        <header className="lesson-banner">
            <div className="lesson-header">
                <div className="lesson-header__breadcrumb">
                    <Breadcrumb crumbs={crumbs} />
                </div>
                <div className="lesson-header__content">
                    <div className="lesson-header__text">
                        <h1 className="lesson-header__title">{title}</h1>
                        {ageTag && (
                            <span className="lesson-header__tag">📍 {ageTag}</span>
                        )}
                        {chapterTitle && (
                            <h2 className="lesson-header__chapter">{chapterTitle}</h2>
                        )}
                        {summary && (
                            <p className="lesson-header__summary">{summary}</p>
                        )}

                        <LessonActions slug={slug} />
                    </div>

                    {image && (
                        <div className="lesson-header__image-block">
                            <Image
                                src={image}
                                alt={title}
                                width={400}
                                height={300}
                                className="lesson-header__img"
                            />
                            {(personageName || personageDates || personageNote) && (
                                <div className="lesson-header__personage">
                                    <p className="lesson-header__personage-name">
                                        {personageName}
                                        {personageDates && ` (${personageDates})`}
                                    </p>
                                    {personageNote && (
                                        <p className="lesson-header__personage-note">
                                            {personageNote}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
