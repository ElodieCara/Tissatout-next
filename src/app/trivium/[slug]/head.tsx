import { getLessonBySlug } from "@/lib/lessons";

export default async function Head({ params }: { params: { slug: string } }) {
    const lesson = await getLessonBySlug(params.slug);

    if (!lesson) return null;

    return (
        <>
            <title>{lesson.title} | Leçon Trivium</title>
            <meta name="description" content={lesson.summary || "Une leçon du Trivium pour éveiller les esprits curieux !"} />
            <meta property="og:title" content={`${lesson.title} | Trivium`} />
            <meta property="og:description" content={lesson.summary || ""} />
        </>
    );
}
