export interface Drawing {
    createdAt: string | number | Date;
    id: string;
    title: string;
    imageUrl: string;
    description?: string | null;
    views: number;
    category?: {
        name: string;
    } | null;
    likes: number;
    slug?: string;
}

