import { getCollectionsWithLessons } from "@/lib/lessons";
import LessonModulePage from "@/components/Module/LessonModulePage";
import type { CollectionWithLessons } from "@/types/lessons";

type ModuleKey = "trivium" | "quadrivium";

export default async function ModulePage({
    params,
}: {
    params: { module: string };
}) {
    // ✅ Renommage pour éviter le conflit avec la variable globale `module`
    const moduleSlug: ModuleKey =
        params.module === "trivium" || params.module === "quadrivium"
            ? (params.module as ModuleKey)
            : "trivium";

    const rawCollections: CollectionWithLessons[] =
        await getCollectionsWithLessons(moduleSlug);

    // 🔧 Ajout du lessonsCount attendu
    const collections = rawCollections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        slug: collection.slug,
        description: collection.description ?? null,
        lessonsCount: collection.lessons.length,
        lessons: collection.lessons,
        module: collection.module as ModuleKey,
    }));

    // 🔁 Fusion de toutes les leçons
    const lessons = collections.flatMap((c) => c.lessons);

    return (
        <LessonModulePage
            module={moduleSlug}
            collections={collections}
            lessons={lessons}
        />
    );
}
