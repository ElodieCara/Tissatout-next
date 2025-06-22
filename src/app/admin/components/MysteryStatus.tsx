"use client";

import { useMemo } from "react";
import { useState, useEffect } from "react";

// Composant pour afficher le statut mystère
interface MysteryStatusProps {
    isMystery: boolean;
    mysteryUntil?: string | null;
    mysteryStatus?: string | null;
}

export function MysteryStatus({ isMystery, mysteryUntil, mysteryStatus }: MysteryStatusProps) {
    if (!isMystery) return null;

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case "RÉVÉLÉE": return "text-green-600 bg-green-100";
            case "EN ATTENTE": return "text-orange-600 bg-orange-100";
            case "SANS DATE": return "text-red-600 bg-red-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Aucune date définie";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="mystery-status">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(mysteryStatus ?? null)}`}>
                🎭 Mystère - {mysteryStatus}
            </span>
            <div className="text-xs text-gray-500 mt-1">
                Révélation: {formatDate(mysteryUntil ?? null)}
            </div>
        </div>
    );
}

// Hook personnalisé pour vérifier si une activité mystère doit être visible
export function useIsMysteryVisible(isMystery: boolean, mysteryUntil: string | null): boolean {
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        if (!isMystery || !mysteryUntil) return;

        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000 * 30); // Mise à jour toutes les 30 secondes

        return () => clearInterval(interval);
    }, [isMystery, mysteryUntil]);

    if (!isMystery) return true;
    if (!mysteryUntil) return false;

    const revealDate = new Date(mysteryUntil).getTime();
    return currentTime >= revealDate;
}