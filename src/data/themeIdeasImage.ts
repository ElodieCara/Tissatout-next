// src/data/themeImages.ts
export type Theme = "winter" | "christmas" | "easter" | "spring" | "summer" | "autumn" | "toussaint" | "chandeleur" | "saintJean" | "epiphanie" | "default";

const themeImages: Record<Theme, { icon: string; background: string }> = {
    winter: {
        icon: "/icons/winter.png",
        background: "/bg/winter-bg.png",
    },
    christmas: {
        icon: "/icons/christmas.png",
        background: "/bg/christmas-bg.png",
    },
    easter: {
        icon: "/icons/easter.png",
        background: "/bg/easter-bg.png",
    },
    spring: {
        icon: "/icons/spring.png",
        background: "/bg/spring-bg.png",
    },
    summer: {
        icon: "/icons/summer.png",
        background: "/bg/summer-bg.png",
    },
    autumn: {
        icon: "/icons/autumn.png",
        background: "/bg/autumn-bg.png",
    },
    toussaint: {
        icon: "/icons/themes/toussaint.png",
        background: "/bg/toussaint-bg.png",
    },
    chandeleur: {
        icon: "/icons/themes/chandeleur.png",
        background: "/bg/chandeleur-bg.png",
    },
    saintJean: {
        icon: "/icons/themes/saintjean.png",
        background: "/bg/saintjean-bg.png",
    },
    epiphanie: {
        icon: "/icons/themes/epiphanie.png",
        background: "/bg/epiphanie-bg.png",
    },
    default: {
        icon: "/icons/idea-default.png",
        background: "/bg/default-bg.png",
    },
};

export default themeImages;
