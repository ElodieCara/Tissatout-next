export const themeMapping: Record<string, string> = {
    "Hiver": "winter",
    "Printemps": "spring",
    "Été": "summer",
    "Automne": "autumn",
    "Toussaint": "Toussaint",
    "Noël": "christmas",
    "Pâques": "easter",
    "Chandeleur": "chandeleur",
    "Saint-Jean": "saint-jean",
    "Epiphanie": "epiphanie",
};

const reverseThemeMapping: Record<string, string> = Object.fromEntries(
    Object.entries(themeMapping).map(([fr, en]) => [en, fr])
);

export { reverseThemeMapping };
