import { getCollectionsWithLessons } from "@/lib/lessons";
import LessonModulePage from "@/components/Module/LessonModulePage";
import type { CollectionWithLessons } from "@/types/lessons";

export default async function ModulePage({ params }: { params: { module: string } }) {
    const module = (params.module === "trivium" || params.module === "quadrivium"
        ? params.module
        : "trivium") as "trivium" | "quadrivium";

    const rawCollections: CollectionWithLessons[] = await getCollectionsWithLessons(module);
    // 🔧 Ajout manuel du `lessonsCount` attendu
    const collections = rawCollections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        slug: collection.slug,
        description: collection.description ?? null,
        lessonsCount: collection.lessons.length,
        lessons: collection.lessons, // On conserve les leçons pour usage interne
        module: collection.module as "trivium" | "quadrivium",
    }));

    // 🔁 Fusion de toutes les leçons
    const lessons = collections.flatMap(c => c.lessons);

    return (
        <LessonModulePage
            module={module}
            collections={collections}
            lessons={lessons}
        />
    );
}
