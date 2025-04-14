import { getCollectionsWithLessons } from "../../lib/lessons";
import LessonModulePage from "./../../components/Module/LessonModulePage";

export default async function QuadriviumPage() {
    const rawCollections = await getCollectionsWithLessons("quadrivium");

    const collections = rawCollections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        slug: collection.slug,
        description: collection.description ?? null,
        lessonsCount: collection.lessons.length,
        lessons: collection.lessons,
    }));

    const lessons = collections.flatMap((c) => c.lessons);

    return (
        <LessonModulePage
            module="quadrivium"
            collections={collections}
            lessons={lessons}
        />
    );
}