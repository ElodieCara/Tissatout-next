import { getDrawingById } from "@/lib/server"; // ✅ Fetch depuis Prisma
import DrawingPage from "./DrawingPage";

export default async function Page({ params }: { params: { id: string } }) {
    const drawing = await getDrawingById(params.id);

    if (!drawing) {
        return <p className="drawing-page--error">❌ Coloriage introuvable.</p>;
    }

    return <DrawingPage drawing={drawing} />;
}
