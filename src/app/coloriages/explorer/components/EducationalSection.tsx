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

interface EducationalSectionProps {
    educationalDrawings: Record<string, Drawing[]>;
}

export default function EducationalSection({ educationalDrawings }: EducationalSectionProps) {
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
