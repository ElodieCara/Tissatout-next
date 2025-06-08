import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";
import { generateSlug } from "@/lib/utils";

const categoriesData: Record<string, string[]> = {
    "Trivium & Quadrivium": [
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
            <h2>Apprendre en s'amusant</h2>
            <p className="section-subtitle">Découvrez nos coloriages éducatifs pour apprendre les lettres, les chiffres et bien plus encore !</p>

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
                            slug={drawings[0].slug || generateSlug(drawings[0].title, drawings[0].id)}
                        />
                    )
                ))}
            </div>
        </div>
    );
}
