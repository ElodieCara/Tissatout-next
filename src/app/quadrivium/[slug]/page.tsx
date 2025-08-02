
import LessonPage from "@/components/LessonPage/LessonPage";
import { getLessonBySlug } from "@/lib/lessons";


interface Params {
    params: { slug: string }
}

export default async function QuadriviumLessonPage({ params }: Params) {
    const lesson = await getLessonBySlug(params.slug);

    if (!lesson || lesson.module !== "quadrivium") {
        return <div>Leçon non trouvée.</div>; // Ou pas de rendu/404
    }

    return <LessonPage lesson={lesson} />;
}
