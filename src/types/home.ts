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

export interface Idea {
    id: number;
    image: StaticImageData;
    title: string;
    description: string;
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

