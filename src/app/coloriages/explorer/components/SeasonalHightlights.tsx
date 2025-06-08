import React from "react";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";
import { generateSlug } from "@/lib/utils";

interface SeasonalHighlightsProps {
    showViews?: boolean;
    showLikes?: boolean;
    topLikedDrawings: Drawing[];
}

const SeasonalHighlights: React.FC<SeasonalHighlightsProps> = ({
    showViews = false,  // ❌ Par défaut, on ne montre PAS les vues
    showLikes = true,    // ✅ Par défaut, on affiche les likes
    topLikedDrawings
}) => {
    return (
        <section className="seasonal-highlights">
            <h2>Coups de cœur</h2>
            <p className="section-subtitle">Découvrez nos coloriages les plus appréciés par la communauté ❤️</p>

            <div className="explorer-grid">
                {topLikedDrawings.length > 0 ? (
                    topLikedDrawings.map((drawing, index) => (
                        <DrawingCard
                            key={`${drawing.id}-${index}`}
                            id={drawing.id}
                            imageUrl={drawing.imageUrl}
                            theme={drawing.title}
                            views={drawing.views ?? 0}
                            likeCount={drawing.likes ?? 0}
                            showButton={false}
                            showViews={showViews}
                            showLikes={showLikes}
                            slug={drawing.slug || generateSlug(drawing.title, drawing.id)}
                        />
                    ))
                ) : (
                    <p>⚠️ Aucun coloriage trouvé.</p>
                )}
            </div>
        </section>
    );
};

export default SeasonalHighlights;
