import { Suspense } from "react";
import { getDrawingBySlug } from "@/lib/server";
import DrawingPage from "./DrawingPage";
import DrawingSidebar from "@/app/coloriages/[id]/components/DrawingSidebar/DrawingSidebar";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    // Il faut attendre les paramètres avant de les utiliser
    const resolvedParams = await params;

    console.log("📌 Params résolus :", resolvedParams);

    if (!resolvedParams?.id) {
        console.error("❌ Erreur : ID manquant dans les paramètres.");
        return <p className="drawing-page--error">⚠️ Erreur : ID invalide ou manquant.</p>;
    }

    // Maintenant utilisez resolvedParams.id au lieu de params.id
    console.log("🔍 ID complet reçu :", resolvedParams.id);

    // Extraction du slug et de l'ID
    const slugParts = resolvedParams.id.split("-");
    if (slugParts.length < 2) {
        console.error("⚠️ URL mal formée :", resolvedParams.id);
        return <p className="drawing-page--error">❌ Erreur : URL invalide.</p>;
    }

    const idTronque = slugParts.pop()!;
    const slug = slugParts.join("-");

    console.log("🔍 Slug extrait :", slug);
    console.log("🔍 ID tronqué :", idTronque);

    try {
        const drawing = await getDrawingBySlug(slug);

        if (!drawing || !drawing.id.startsWith(idTronque)) {
            console.error(`⚠️ Aucun coloriage trouvé pour : ${slug}-${idTronque}`);
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
                        <DrawingSidebar
                            category={drawing.category.name}
                            currentDrawingId={drawing.id}
                        />
                    </Suspense>
                )}
            </div>
        );
    } catch (error) {
        console.error("❌ Erreur serveur lors du chargement du coloriage :", error);
        return <p className="drawing-page--error">⚠️ Erreur interne du serveur. Réessayez plus tard.</p>;
    }
}