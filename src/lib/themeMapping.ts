export const themeMapping: Record<string, string> = {
    "Hiver": "winter",
    "Printemps": "spring",
    "Été": "summer",
    "Automne": "autumn",
    "Halloween": "halloween",
    "Noël": "christmas",
    "Pâques": "easter",
};

const reverseThemeMapping: Record<string, string> = Object.fromEntries(
    Object.entries(themeMapping).map(([fr, en]) => [en, fr])
);

export { reverseThemeMapping };
