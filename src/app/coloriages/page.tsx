import { getDrawings } from "@/lib/server";
import ColoriagePage from "./ColoriagesPage";

export default async function Page() {
    const drawings = await getDrawings(); // ✅ Récupération côté serveur

    return <ColoriagePage drawings={drawings} />;
}
