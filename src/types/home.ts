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
}

export interface News {
    id: number;
    image: StaticImageData;
    title: string;
    iconSrc: StaticImageData;
    description: string;
    date: string;
}

export interface Idea {
    id: number;
    image: StaticImageData;
    title: string;
    description: string;
}

