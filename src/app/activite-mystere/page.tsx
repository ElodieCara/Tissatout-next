import { getMysteryGame } from "@/lib/printables";

export default async function ActiviteMysterePage() {
    const game = await getMysteryGame();
    if (!game) { /* afficher message “Pas d’activité mystère” */ }
    // rend ton UI avec `game`
}
