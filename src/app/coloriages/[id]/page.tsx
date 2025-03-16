import { Suspense } from "react";
import { getDrawingById } from "@/lib/server";
import DrawingPage from "./DrawingPage";
import DrawingSidebar from "@/app/coloriages/[id]/components/DrawingSidebar/DrawingSidebar";


export default async function Page({ params }: { params: { id: string } }) {
    const drawing = await getDrawingById(params.id);

    if (!drawing) {
        return <p className="drawing-page--error">❌ Coloriage introuvable.</p>;
    }

    return (
        <div className="drawing-page-container">
            {/* ✅ Affichage du coloriage principal */}
            <DrawingPage drawing={drawing} />

            {/* ✅ Ajout d'un Suspense pour le sidebar */}
            {drawing.category && (
                <Suspense fallback={<p className="drawing-sidebar--loading">Chargement des coloriages similaires...</p>}>
                    <DrawingSidebar category={drawing.category.name} currentDrawingId={drawing.id} />
                </Suspense>
            )}
        </div>
    );
}
