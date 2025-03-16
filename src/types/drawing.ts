export interface Drawing {
    id: string;
    title: string;
    imageUrl: string;
    views: number;
    category?: {
        name: string;
    } | null;
    likes: number;
}

