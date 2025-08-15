import D6 from "@/assets/D6.png";


import { Slide, Activity } from "@/types/home"; // Types définis


export type ActivityCategory = "trivium" | "quadrivium";

export const slide: Slide[] = [
    { id: 1, image: D6 },
    { id: 2, image: D6 },
    { id: 3, image: D6 },
];

export const activities: Record<ActivityCategory, Activity[]> = {
    trivium: [
        {
            title: "Grammaire",
            icon: "/icons/lecture.png",
            link: "/grammaire",
        },
        {
            title: "Logique",
            icon: "/icons/defis.png",
            link: "/logique",
        },
        {
            title: "Rhétorique",
            icon: "/icons/debat.png",
            link: "/rhetorique",
        },
    ],
    quadrivium: [
        {
            title: "Arithmétique",
            icon: "/icons/chiffre.png",
            link: "/arithmetique",
        },
        {
            title: "Géométrie",
            icon: "/icons/lego.png",
            link: "/geometrie",
        },
        {
            title: "Musique",
            icon: "/icons/musique.png",
            link: "/musique",
        },
        {
            title: "Astronomie",
            icon: "/icons/etoile.png",
            link: "/astronomie",
        },
    ]
};