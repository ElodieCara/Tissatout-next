import React from "react";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";
import { generateSlug } from "@/lib/utils";

interface TrendingSectionProps {
    trendingDrawings: Drawing[];
    showViews?: boolean;
    showLikes?: boolean;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({
    trendingDrawings,
    showViews = true,
    showLikes = false  // 🔥 Les likes sont désactivés pour les tendances
}) => {
    return (
        <section className="trending-section">
            <h2>🔥 Tendances</h2>
            <div className="explorer-grid">
                {trendingDrawings.length > 0 ? (
                    trendingDrawings.map((drawing, index) => (
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
                    <p>⏳ Chargement des tendances...</p>
                )}
            </div>
        </section>
    );
};

export default TrendingSection;
