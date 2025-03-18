import { Suspense } from "react";
import { getDrawingById } from "@/lib/server";
import DrawingPage from "./DrawingPage";
import DrawingSidebar from "@/app/coloriages/[id]/components/DrawingSidebar/DrawingSidebar";

export default async function Page({ params }: { params?: { id?: string } }) {
    console.log("📌 Params reçus :", params);

    // Await the params object
    const resolvedParams = await params;

    if (!resolvedParams?.id) {
        console.error("❌ Erreur : ID manquant dans les paramètres.");
        return <p className="drawing-page--error">⚠️ Erreur : ID invalide ou manquant.</p>;
    }

    try {
        console.log(`🔍 Recherche du coloriage avec l'ID : ${resolvedParams.id}`);
        const drawing = await getDrawingById(resolvedParams.id);

        if (!drawing) {
            console.error(`⚠️ Aucun coloriage trouvé pour l'ID : ${resolvedParams.id}`);
            return <p className="drawing-page--error">❌ Coloriage introuvable.</p>;
        }
        console.log("✅ Dessin trouvé :", drawing);

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
    } catch (error) {
        console.error("❌ Erreur serveur lors du chargement du coloriage :", error);
        return <p className="drawing-page--error">⚠️ Erreur interne du serveur. Réessayez plus tard.</p>;
    }
}
