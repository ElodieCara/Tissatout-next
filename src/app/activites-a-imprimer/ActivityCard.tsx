"use client";

import Image from "next/image";
import Link from "next/link";
import { useIsMysteryVisible } from "@/app/admin/components/MysteryStatus";
import MysteryActivityCard from "./MysteryActivityCard";

interface Props {
    id: string;
    slug: string;
    title: string;
    ageRange: string;
    imageUrl: string;
    pdfUrl: string;
    pdfPrice?: number;
    themes?: string[];
    types?: string[];
    isMystery?: boolean;
    mysteryUntil?: string | null;
    isAdminView?: boolean;
}


export default function ActivityCard({
    id,
    slug,
    title,
    ageRange,
    imageUrl,
    pdfUrl,
    pdfPrice,
    themes,
    types,
    isMystery = false,
    mysteryUntil = null,
    isAdminView = false,
}: Props) {
    const isVisible = useIsMysteryVisible(isMystery, mysteryUntil);

    if (isMystery && mysteryUntil && !isVisible) {
        return (
            <MysteryActivityCard
                mysteryUntil={mysteryUntil}
                ageRange={ageRange}
            />
        );
    }

    const now = new Date();
    const parsedMysteryDate = mysteryUntil ? new Date(mysteryUntil) : null;

    console.log('🧩 DEBUG ActivityCard', {
        title,
        isMystery,
        mysteryUntilRaw: mysteryUntil,
        mysteryUntilParsed: parsedMysteryDate?.toISOString(),
        now: now.toISOString(),
        isVisible,
        isAdminView,
        shouldShowMystery: isMystery && !isVisible && mysteryUntil && !isAdminView
    });


    if (isMystery) {
        if (!mysteryUntil) {
            // Cas anormal, à gérer
            return null;
        }
        const now = new Date();
        const revealDate = new Date(mysteryUntil);

        if (now < revealDate) {
            // ✅ ON AFFICHE LA CARTE MYSTÈRE
            return <MysteryActivityCard mysteryUntil={mysteryUntil} ageRange={ageRange} />;
        }
        // ✅ SI RÉVÉLÉE, ON AFFICHE LA CARTE NORMALE
    }


    const priceLabel =
        typeof pdfPrice === "number"
            ? pdfPrice === 0
                ? "Gratuit"
                : `${pdfPrice.toFixed(2)} €`
            : "Prix non défini";

    return (
        <article className="activity-card">
            {/* Badge mystère visible côté admin */}
            {isMystery && isAdminView && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#667eea',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    zIndex: 10
                }}>
                    🎭 MYSTÈRE
                </div>
            )}

            <Link href={`/activites-a-imprimer/${slug}`} className="activity-card__link">
                <div className="activity-card__image-wrapper">
                    <Image
                        src={imageUrl}
                        alt={title}
                        width={400}
                        height={300}
                        className="activity-card__image"
                    />
                </div>
            </Link>

            <div className="activity-card__content">
                <div className="activity-card__tags activity-card__tags--top">
                    <span className="activity-card__tag activity-card__tag--age">{ageRange}</span>
                </div>

                <Link href={`/activites-a-imprimer/${slug}`}>
                    <h3 className="activity-card__title">{title}</h3>
                </Link>

                <p className="activity-card__price">{priceLabel}</p>

                {(types?.length || themes?.length) && (
                    <div className="activity-card__tags">
                        {types?.map((type) => (
                            <span key={type} className="activity-card__tag">{type}</span>
                        ))}
                        {themes?.map((theme) => (
                            <span key={theme} className="activity-card__tag">{theme}</span>
                        ))}
                    </div>
                )}

                <div className="activity-card__cta">
                    <Link
                        href={`/activites-a-imprimer/${slug}`}
                        className="activity-card__btn"
                    >
                        <Image
                            src="/icons/activites/voiractivite.png"
                            alt="Voir l'activité"
                            width={18}
                            height={18}
                            style={{ verticalAlign: "middle", marginRight: "6px" }}
                        />
                        Voir l'activité
                    </Link>
                </div>

                {/* Date de révélation côté admin */}
                {isMystery && isAdminView && mysteryUntil && (
                    <div style={{
                        marginTop: '8px',
                        padding: '8px',
                        background: '#f0f0f0',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                    }}>
                        <strong>Révélation :</strong> {new Date(mysteryUntil).toLocaleDateString('fr-FR')}
                    </div>
                )}
            </div>
        </article>
    );
}