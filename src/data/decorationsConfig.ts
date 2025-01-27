import { Theme } from "@/types/theme"; // Assurez-vous que le chemin est correct


export const decorationsConfig: Record<Theme, { className: string }[]> = {
    "summer-theme": [
        { className: "decoration-star" },
        { className: "decoration-balloon" },
        { className: "decoration-rocket" },
    ],
    "winter-theme": [
        { className: "decoration-snowflake" },
        { className: "decoration-snowman" },
        { className: "decoration-hot-chocolate" },
    ],
    "spring-theme": [
        { className: "decoration-flower" },
        { className: "decoration-butterfly" },
        { className: "decoration-nest" },
    ],
    "autumn-theme": [
        { className: "decoration-mushroom" },
        { className: "decoration-acorns" },
        { className: "decoration-owl" },
    ],
    "halloween-theme": [
        { className: "decoration-pumpkin" },
        { className: "decoration-ghost" },
        { className: "decoration-witch-hat" },
    ],
    "christmas-theme": [
        { className: "decoration-christmas-tree" },
        { className: "decoration-gift" },
        { className: "decoration-lights" },
    ],
    "easter-theme": [
        { className: "decoration-egg" },
        { className: "decoration-bunny" },
        { className: "decoration-carrot" },
    ],
    "back-to-school-theme": [
        { className: "decoration-bag" },
        { className: "decoration-ruler" },
        { className: "decoration-lamp" },
    ],
    // Ajoutez une entrée vide pour "default-theme"
    "default-theme": [],
};
