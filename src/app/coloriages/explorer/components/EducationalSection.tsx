import { useEffect, useState } from "react";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";

const categoriesData: Record<string, string[]> = {
    "Éducatif & Trivium": [
        "Grammaire - Lettres",
        "Grammaire - Mots",
        "Grammaire - Chiffres",
        "Logique - Puzzle",
        "Logique - Coloriages numérotés",
        "Logique - Labyrinthe",
        "Rhétorique - Histoires",
        "Rhétorique - Mythologie",
        "Rhétorique - Philosophie"
    ]
};

export default function EducationalSection() {
    const [educationalDrawings, setEducationalDrawings] = useState<Record<string, Drawing[]>>({});

    useEffect(() => {
        const fetchEducationalDrawings = async () => {
            const educationalCategory = "Éducatif & Trivium";
            const subCategories = categoriesData[educationalCategory]?.slice(0, 3);

            const newEducationalDrawings: Record<string, Drawing[]> = {};

            try {
                for (const subCategory of subCategories) {
                    const res = await fetch(`/api/drawings?category=${encodeURIComponent(subCategory)}&sort=likes&limit=1`);
                    const data = await res.json();
                    newEducationalDrawings[subCategory] = data;
                }

                setEducationalDrawings(newEducationalDrawings);
            } catch (error) {
                console.error("❌ Erreur lors du fetch des dessins éducatifs :", error);
            }
        };

        fetchEducationalDrawings();
    }, []);

    return (
        <div className="educational-section">
            <h2>🧠 Apprendre en s'amusant</h2>
            <p>Découvrez nos coloriages éducatifs pour apprendre les lettres, les chiffres et bien plus encore !</p>

            <div className="explorer-grid">
                {Object.entries(educationalDrawings).map(([category, drawings]) => (
                    drawings.length > 0 && (
                        <DrawingCard
                            key={`${category}-${drawings[0].id}`}
                            id={drawings[0].id}
                            imageUrl={drawings[0]?.imageUrl || "/images/default-placeholder.png"}
                            theme={category}
                            views={drawings[0]?.views ?? 0}
                            likeCount={drawings[0]?.likes ?? 0}
                            showButton={false}
                        />
                    )
                ))}
            </div>
        </div>
    );
}
