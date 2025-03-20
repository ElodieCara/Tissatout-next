import { StaticImageData } from "next/image";

export interface Slide {
    id: number;
    image: StaticImageData; // Utilisation de StaticImageData
}

export interface Section {
    title: string;
    color: string;
    content: string;
    activities: string[];
    buttonImage: StaticImageData; // Pour les images
    imageCard: StaticImageData;
    description: string;
    conclusion: string;
    tags?: Tag[];
}

export interface News {
    id: number;
    image: StaticImageData;
    title: string;
    iconSrc: StaticImageData;
    category: string; // 📌 Catégorie sous forme de texte
    tags: string[]; // 📌 Tableau de tags (âges)
    author: string;
    description: string;
    date: string;
}

export interface Article {
    id: string;
    title: string;
    content: string;
    description?: string;
    image?: string;
    iconSrc?: string;
    date?: string;
    category?: string;
    tags?: string[];
}

export interface Idea {
    id: string;
    title: string;
    description: string;
    image?: string;
    theme: string;
    createdAt: string;
}

export interface Tag {
    label: string;
    color: string;
}

export type Activity = {
    title: string;
    icon: string;
    link: string;
};

export interface Advice {
    id: string;
    title: string;
    content: string;
    description?: string;
    category: string;
    imageUrl?: string;
}

export interface Section {
    title: string;
    description: string;
    slug: string;  // ✅ Ajoute cette ligne ici !
}
