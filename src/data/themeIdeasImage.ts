// src/data/themeImages.ts
export type Theme = "winter" | "christmas" | "easter" | "spring" | "summer" | "autumn" | "halloween" | "default";

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
    halloween: {
        icon: "/icons/halloween.png",
        background: "/bg/halloween-bg.png",
    },
    default: {
        icon: "/icons/idea-default.png",
        background: "/bg/default-bg.png",
    },
};

export default themeImages;
