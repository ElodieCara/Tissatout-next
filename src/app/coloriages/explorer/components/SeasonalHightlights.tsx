"use client";

import React, { useEffect, useState } from "react";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";

interface SeasonalHighlightsProps {
    showViews?: boolean;
    showLikes?: boolean;
}

const SeasonalHighlights: React.FC<SeasonalHighlightsProps> = ({
    showViews = false,  // ❌ Par défaut, on ne montre PAS les vues
    showLikes = true    // ✅ Par défaut, on affiche les likes
}) => {
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGlobalTopDrawings = async () => {
            try {
                console.log("📌 Fetching les dessins les plus likés...");

                // Récupération des 3 premiers dessins les plus likés
                const res = await fetch(`/api/drawings?sort=likes&limit=3`);
                const data = await res.json();

                console.log("✅ Dessins les plus likés récupérés :", data);

                let drawingsWithBonus = [...data];

                // Vérification et ajout d'une 4ème image bonus si besoin
                if (drawingsWithBonus.length < 4) {
                    const resBonus = await fetch(`/api/drawings?sort=likes&limit=1&offset=3`);
                    const bonusData = await resBonus.json();

                    if (bonusData.length > 0) {
                        console.log("🎁 Bonus ajouté :", bonusData[0]);
                        drawingsWithBonus.push(bonusData[0]);
                    }
                }

                setDrawings(drawingsWithBonus);
            } catch (error) {
                console.error("❌ Erreur lors du fetch des dessins les plus likés globalement :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGlobalTopDrawings();
    }, []);

    return (
        <section className="seasonal-highlights">
            <h2>📌 Coups de cœur</h2>
            <p>Découvrez nos coloriages les plus appréciés par la communauté ❤️</p>

            <div className="explorer-grid">
                {loading ? (
                    <p>⏳ Chargement des coloriages les plus appréciés...</p>
                ) : drawings.length > 0 ? (
                    drawings.map((drawing, index) => (
                        <DrawingCard
                            key={`${drawing.id}-${index}`}
                            id={drawing.id}
                            imageUrl={drawing.imageUrl}
                            theme={drawing.title}
                            views={drawing.views ?? 0}
                            likeCount={drawing.likes ?? 0}
                            showButton={false}
                            showViews={showViews}  // ✅ Active/désactive les vues
                            showLikes={showLikes}
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
