import { getTriviumLessons, getLessonBySlug } from "@/lib/lessons";
import TriviumCategory from "./TriviumCategoryPage";
import LessonPage from "@/components/LessonPage/LessonPage"; // à créer si pas fait
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;

    if (["grammaire", "logique", "rhetorique"].includes(slug)) {
        const lessons = await getTriviumLessons();
        const filtered = lessons.filter((l) => l.subcategory === slug); // ← 💡 important
        return <TriviumCategory category={slug} lessons={filtered} />;
    }


    const lesson = await getLessonBySlug(slug);
    if (!lesson) return notFound();

    return <LessonPage lesson={lesson} />;
}
