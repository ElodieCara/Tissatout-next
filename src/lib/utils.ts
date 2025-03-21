export function generateSlug(title: string, id?: string): string {
    const baseSlug = title
        .toLowerCase()
        .normalize("NFD") // Supprime les accents
        .replace(/[\u0300-\u036f]/g, "") // Supprime les caractères diacritiques
        .replace(/[^a-z0-9]+/g, "-") // Remplace tout ce qui n'est pas alphanumérique par "-"
        .replace(/^-+|-+$/g, "") // Supprime les tirets en début/fin de chaîne
        .substring(0, 50); // Tronque à 50 caractères max

    return id ? `${baseSlug}-${id.substring(0, 6)}` : baseSlug; // Ajoute l'ID MongoDB s'il existe
}
