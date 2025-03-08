import React, { useEffect, useState } from "react";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";

interface TrendingSectionProps {
    category?: string;
    onSubCategorySelect?: (subCategory: string) => void;
    showViews?: boolean;
    showLikes?: boolean;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ category,
    onSubCategorySelect,
    showViews = true,
    showLikes = false  // 🔥 Les likes sont désactivés pour les tendances
}) => {
    const [trendingDrawings, setTrendingDrawings] = useState<Drawing[]>([]);

    useEffect(() => {
        const fetchTrendingDrawings = async () => {
            try {
                const res = await fetch(`/api/drawings?sort=views&limit=4${category ? `&category=${encodeURIComponent(category)}` : ""}`);
                const data = await res.json();
                setTrendingDrawings(data);
            } catch (error) {
                console.error("❌ Erreur lors du fetch des tendances :", error);
            }
        };

        fetchTrendingDrawings();
    }, [category]);

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
                            showViews={showViews}  // ✅ Active/désactive les vues
                            showLikes={showLikes}  // ❌ Désactivé par défaut
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
