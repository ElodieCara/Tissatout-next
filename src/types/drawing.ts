export interface Drawing {
    createdAt: string | number | Date;
    id: string;
    title: string;
    imageUrl: string;
    views: number;
    category?: {
        name: string;
    } | null;
    likes: number;
    slug?: string;
}

