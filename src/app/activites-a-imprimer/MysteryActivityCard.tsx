"use client";

import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";
import StarfieldCanvas from "@/components/FloatingIcon/FloatingIconsEnhanced";
import FloatingIconsEnhanced from "@/components/FloatingIcon/FloatingIconsEnhanced";
import EnhancedFloatingIcons from "@/components/FloatingIcon/FloatingIconsEnhanced";
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
        <article className="activity-card mystery-bg"  >
            <FloatingIconsEnhanced />
            {/* <FloatingIcons /> */}
            {/* Image mystère - même structure que ActivityCard */}
            <div className="activity-card__link">
                <div className="activity-card__image-wrapper" style={{ position: "relative" }}>
                    {/* Floating icons en arrière-plan */}
                    <FloatingIcons />
                    <div
                        className="activity-card__image mystery-image"
                        style={{
                            //background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            width: '100%',
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
                            textAlign: 'center',
                            // width: '50%'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
                                <Image
                                    src="/icons/theatre.png"
                                    alt="Mystère"
                                    width={100}
                                    height={100}
                                    // style={{ verticalAlign: "middle" }}
                                    style={{ pointerEvents: 'none', transform: "scale(1.2)", transition: "transform .3s" }}
                                />
                            </div>
                            <div style={{
                                fontSize: '3rem', opacity: 0.8,
                                color: "#ffd700",
                                textShadow: "rgb(255 215 0 / 50%)",
                                fontWeight: 'bold',
                                animation: 'pulseShine 1.5s infinite',
                                pointerEvents: 'none',
                            }}>?</div>

                            <style jsx>
                                {`
                               @keyframes pulseShine {
                                    0%, 100% { 
                                        transform: scale(1); 
                                        opacity: 0.8;
                                        text-shadow: 0 0 10px rgb(255 215 0 / 50%);
                                    }
                                    50% { 
                                        transform: scale(1.15); 
                                        opacity: 1;
                                        text-shadow: 
                                            0 0 20px rgb(255 215 0 / 80%), 
                                            0 0 30px rgb(255 215 0 / 60%);
    }
                                }
                                `}</style>
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
                    <h3 className="activity-card__title" style={{
                        display: 'inline-flex', pointerEvents: 'none', alignItems: 'center', lineHeight: '1', gap: '5px', fontWeight: 600,          // un peu plus gras
                        color: '#2A4D69'
                    }}>
                        <Image
                            src="/icons/theatre.png"
                            alt="Mystère"
                            width={24}
                            height={24}
                            // style={{ verticalAlign: "middle" }}
                            style={{
                                transform: "scale(1.2)", transition: "transform .3s", pointerEvents: 'none',
                            }}
                        />Activité Mystère</h3>
                </div>

                {/* Prix mystère */}
                <p className="activity-card__price">Surprise</p>

                {/* Tags mystère */}
                <div className="activity-card__tags" >
                    <span className="activity-card__tag" style={{
                        background: '#dca08d',
                    }}>Mystère</span>
                    <span className="activity-card__tag" style={{
                        background: '#dca08d',
                    }}>Nouveauté</span>
                </div>

                {/* Date de révélation au lieu du CTA */}
                <div className="activity-card__cta">
                    <div
                        className="activity-card__btn"
                        style={{
                            background: '#dca08d',
                            cursor: 'default',
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
