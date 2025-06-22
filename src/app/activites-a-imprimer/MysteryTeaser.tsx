"use client";

import { useEffect, useState } from "react";

// Composant pour afficher une activité mystère en attente
function MysteryTeaser({ mysteryUntil }: { mysteryUntil: string }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const reveal = new Date(mysteryUntil).getTime();
            const distance = reveal - now;

            if (distance < 0) {
                setTimeLeft("Révélée maintenant !");
                // Optionnel : recharger la page pour afficher l'activité
                // window.location.reload();
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

                if (days > 0) {
                    setTimeLeft(`Dans ${days}j ${hours}h`);
                } else if (hours > 0) {
                    setTimeLeft(`Dans ${hours}h ${minutes}m`);
                } else {
                    setTimeLeft(`Dans ${minutes}m`);
                }
            }
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [mysteryUntil]);

    return (
        <div className="mystery-teaser">
            <div className="mystery-card">
                <div className="mystery-icon">🎭</div>
                <h3>Activité Mystère</h3>
                <p className="mystery-description">
                    Une nouvelle activité sera révélée bientôt !
                </p>
                <div className="mystery-countdown">
                    <span className="countdown-label">Révélation :</span>
                    <span className="countdown-time">{timeLeft}</span>
                </div>
                <div className="mystery-date">
                    {new Date(mysteryUntil).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    );
}

export default MysteryTeaser;