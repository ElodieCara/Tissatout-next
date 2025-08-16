export const dynamic = 'force-dynamic';

import { getMysteryGame } from "@/lib/printables";

export default async function ActiviteMysterePage() {
    const game = await getMysteryGame().catch(() => null);
    if (!game) {

        return null;
    }
    // rend ton UI avec `game`
}
