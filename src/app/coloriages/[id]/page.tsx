import { Suspense } from "react";
import { getDrawingBySlug } from "@/lib/server";
import { getRandomSuggestions } from "@/lib/suggestions";
import DrawingPage from "./DrawingPage";
import DrawingSidebar from "@/app/coloriages/[id]/components/DrawingSidebar/DrawingSidebar";
import ArticleFeedback from "@/components/Feedback/Feedback";
import CommentList from "@/components/CommentList/CommentList";
import NewsletterBanner from "@/components/NewsletterBanner/NewsletterBanner";
import SuggestionsForParents from "@/components/SuggestionsForParents/SuggestionsForParents";

export default async function Page({ params }: { params: { id: string } }) {
    // Il faut attendre les paramètres avant de les utiliser
    const resolvedParams = await params;

    console.log("📌 Params résolus :", resolvedParams);

    if (!resolvedParams?.id) {
        console.error("❌ Erreur : ID manquant dans les paramètres.");
        return <p className="drawing-page--error">⚠️ Erreur : ID invalide ou manquant.</p>;
    }

    // On utilise directement le slug complet
    const slug = resolvedParams.id;
    console.log("🔍 Slug reçu :", slug);

    // Tentative de récupération avec le slug complet
    let drawing = await getDrawingBySlug(slug);

    // Si on ne trouve pas, on essaie de retirer l'ID potentiel
    if (!drawing) {
        console.log("❌ Aucun dessin trouvé, tentative sans l'ID");
        const slugWithoutId = slug.split('-').slice(0, -1).join('-');
        console.log("🔎 Nouveau slug sans ID :", slugWithoutId);

        drawing = await getDrawingBySlug(slugWithoutId);
    }

    if (!drawing) {
        console.error(`⚠️ Aucun coloriage trouvé pour : ${slug}`);
        return <p className="drawing-page--error">❌ Coloriage introuvable.</p>;
    }

    const suggestions = await getRandomSuggestions("coloriages", 5);

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

            {/* 💬 Et toi, qu'en as-tu pensé ? */}
            <section className="comments no-print mystery">
                <ArticleFeedback resourceType="printable" resourceId={drawing.id} />
                <CommentList resourceType="printable" resourceId={drawing.id} />
            </section>

            <section className=" no-print">
                <NewsletterBanner />
            </section>

            <section className="no-print">
                <SuggestionsForParents items={suggestions} />
            </section>
        </div>
    );
}
