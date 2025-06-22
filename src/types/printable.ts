export interface Theme {
    id: string;
    label: string;
    color: string;
}

export interface GameTheme {
    theme: Theme | null;
}

export interface Type {
    id: string;
    label: string;
    color: string;
}

export interface GameType {
    type: Type | null;
}

export interface ExtraImage {
    id: string;
    imageUrl: string;
}

export interface PrintableGame {
    id: string;
    title: string;
    slug: string;
    description: string;
    pdfUrl: string;
    pdfPrice: number | null;
    imageUrl: string;
    previewImageUrl: string | null;
    isPrintable: boolean;
    printPrice: number;
    ageMin: number;
    ageMax: number;
    isFeatured: boolean;
    isMystery: boolean;
    mysteryUntil: string | null; // ou Date si tu préfères le convertir dès l’appel
    createdAt: string;
    updatedAt: string;

    themes: GameTheme[];
    types: GameType[];
    extraImages?: ExtraImage[];
}
