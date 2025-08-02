export interface Lesson {
    id: string;
    title: string;
    slug: string;
    module: "trivium" | "quadrivium";
    content: string;
    image: string | null;
    category: string;
    createdAt: Date;
    summary: string | null;
    revision: string | null;
    homework: string | null;
    ageTag: string | null;
    published: boolean;
    order: number;
    chapterTitle: string;
    personageName: string;
    personageDates: string;
    personageNote: string;
    period?: string | null;
    subcategory?: string;

    // 🔥 Nouveau :
    collectionId: string | null;
    collection?: {
        id: string;
        slug: string;
        title: string;
        module: "trivium" | "quadrivium";
        description?: string | null;
    } | null;
}

export interface Collection {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    createdAt: Date;
    module: "trivium" | "quadrivium";
}

export interface CollectionWithLessons extends Collection {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    module: "trivium" | "quadrivium";
    lessons: Lesson[];
}

export interface ContentItem {
    id: string;
    title: string;
    slug: string;
    type: string;
    image: string | null;
    description: string | null;
    date: string | null; // Changé pour correspondre aux données réelles
    age?: string; // Rendu optionnel car pas toujours présent
    module?: "trivium" | "quadrivium";
    // Propriétés optionnelles supplémentaires pour la compatibilité
    iconSrc?: string | null;
    imageUrl?: string | null;
    tagLabel?: string | null;
    category?: string | null;
}