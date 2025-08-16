// ./src/app/modules/[module]/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { getCollectionsWithLessons } from "@/lib/lessons";
import LessonModulePage from "@/components/Module/LessonModulePage";
import type { CollectionWithLessons } from "@/types/lessons";

type ModuleKey = "trivium" | "quadrivium";
type PageProps = { params: { module: string } };

const isModuleKey = (v: string): v is ModuleKey =>
    v === "trivium" || v === "quadrivium";

export default async function ModulePage({ params }: PageProps) {
    const moduleSlug: ModuleKey = isModuleKey(params.module) ? params.module : "trivium";

    const rawCollections: CollectionWithLessons[] =
        await getCollectionsWithLessons(moduleSlug);

    // ⬇️ Façon attendue par LessonModulePage (avec lessonsCount)
    const collections = rawCollections.map(c => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description ?? null,
        lessonsCount: c.lessons.length,
    }));

    const lessons = rawCollections.flatMap(c => c.lessons);

    return (
        <LessonModulePage
            module={moduleSlug}
            collections={collections}
            lessons={lessons}
        />
    );
}
