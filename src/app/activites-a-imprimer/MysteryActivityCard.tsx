"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Composant MysteryCard - EXACTEMENT comme ActivityCard
interface MysteryCardProps {
    mysteryUntil: string;
    ageRange?: string;
}

function MysteryActivityCard({ mysteryUntil, ageRange = "À découvrir" }: MysteryCardProps) {
    const [timeLeft, setTimeLeft] = useState("");
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const updateCountdown = () => {
            const reveal = new Date(mysteryUntil).getTime();
            const distance = reveal - currentTime;

            if (distance < 0) {
                setTimeLeft("Révélée maintenant !");
            } else {
                // Calcul du temps restant...
            }
        };

        updateCountdown();

        // Mettre à jour le temps courant toutes les secondes
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, [mysteryUntil, currentTime]);

    return (
        <article className="activity-card">
            {/* Image mystère - même structure que ActivityCard */}
            <div className="activity-card__link">
                <div className="activity-card__image-wrapper">
                    {/* Image mystère générée ou placeholder */}
                    <div
                        className="activity-card__image mystery-image"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            width: '400px',
                            height: '300px'
                        }}
                    >
                        {/* Motif mystère */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🎭</div>
                            <div style={{ fontSize: '2rem', opacity: 0.8 }}>?</div>
                        </div>

                        {/* Overlay avec texture */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
                            pointerEvents: 'none'
                        }} />
                    </div>
                </div>
            </div>

            <div className="activity-card__content">
                {/* Tags du haut - même structure */}
                <div className="activity-card__tags activity-card__tags--top">
                    <span className="activity-card__tag activity-card__tag--age">{ageRange}</span>
                </div>

                {/* Titre mystère */}
                <div>
                    <h3 className="activity-card__title">🎭 Activité Mystère</h3>
                </div>

                {/* Prix mystère */}
                <p className="activity-card__price">Surprise</p>

                {/* Tags mystère */}
                <div className="activity-card__tags">
                    <span className="activity-card__tag">Mystère</span>
                    <span className="activity-card__tag">Nouveauté</span>
                </div>

                {/* Date de révélation au lieu du CTA */}
                <div className="activity-card__cta">
                    <div
                        className="activity-card__btn"
                        style={{
                            background: '#667eea',
                            cursor: 'default',
                            opacity: 0.8
                        }}
                    >
                        <Image
                            src="/icons/activites/voiractivite.png"
                            alt="Bientôt disponible"
                            width={18}
                            height={18}
                            style={{ verticalAlign: "middle", marginRight: "6px" }}
                        />
                        Révélation le {new Date(mysteryUntil).toLocaleDateString('fr-FR')}
                    </div>
                </div>
            </div>
        </article>
    );
}

export default MysteryActivityCard;
