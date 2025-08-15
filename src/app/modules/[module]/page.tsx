// ./src/app/modules/[module]/page.tsx
import { getCollectionsWithLessons } from "@/lib/lessons";
import LessonModulePage from "@/components/Module/LessonModulePage";
import type { CollectionWithLessons } from "@/types/lessons";

type ModuleKey = "trivium" | "quadrivium";

export default async function ModulePage({
    params,
}: {
    params: { module: string };
}) {
    // ✅ Accès entre crochets: évite l’identifiant nu `module`
    const paramModule = params?.["module"];
    const moduleSlug: ModuleKey =
        paramModule === "trivium" || paramModule === "quadrivium"
            ? (paramModule as ModuleKey)
            : "trivium";

    const rawCollections: CollectionWithLessons[] = await getCollectionsWithLessons(moduleSlug);

    // ✅ Clé littérale entre crochets pour la propriété "module"
    const collections = rawCollections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        slug: collection.slug,
        description: collection.description ?? null,
        lessonsCount: collection.lessons.length,
        lessons: collection.lessons,
        ["module"]: collection.module as ModuleKey,
    }));

    const lessons = collections.flatMap((c) => c.lessons);

    return (
        <LessonModulePage
            module={moduleSlug}
            collections={collections}
            lessons={lessons}
        />
    );
}
