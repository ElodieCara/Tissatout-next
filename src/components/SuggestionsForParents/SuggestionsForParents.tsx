import Link from "next/link";
import Image from "next/image";

export interface SuggestionItem {
    id: string;
    type: string;
    title: string;
    slug: string;
    age?: string | null;
    date?: string | null;
    image: string | null;
    description?: string | null;
    tagLabel?: string | null;
}

interface SuggestionsForParentsProps {
    items: SuggestionItem[];
}

const SuggestionsForParents: React.FC<SuggestionsForParentsProps> = ({ items }) => {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="suggestions-parents">
            <h3 className="suggestions-parents__header">Vous pourriez aimer aussi :</h3>
            <div className="suggestions-parents__list">
                {items.map((item) => {
                    console.log(item.age);
                    // Sécurité supplémentaire pour l'affichage du badge
                    const isNew = item.date ? new Date(item.date).getTime() > Date.now() - 10 * 24 * 60 * 60 * 1000 : false;

                    return (
                        <Link
                            href={`/${item.type}/${item.slug}`}
                            key={item.id}
                            className="suggestions-parents__card"
                        >
                            {item.image && (
                                <div className="suggestions-parents__image-wrapper">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={200}
                                        height={150}
                                        className="suggestions-parents__image"
                                    />
                                </div>
                            )}
                            <div className="suggestions-parents__info">
                                {/* Sécurité supplémentaire pour l'affichage du tag */}
                                {item.age ? (
                                    <span className="suggestions-parents__tag">
                                        {item.age}
                                    </span>
                                ) : (
                                    <span className="suggestions-parents__tag">
                                        Âge inconnu
                                    </span>
                                )}

                                {isNew && (
                                    <span className="suggestions-parents__badge">
                                        Nouveau
                                    </span>
                                )}

                                <h3 className="suggestions-parents__title">{item.title}</h3>
                                <p className="suggestions-parents__description">
                                    {item.description
                                        ? item.description.slice(0, 120) + (item.description.length > 120 ? "…" : "")
                                        : "Pas de description disponible."}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default SuggestionsForParents;
