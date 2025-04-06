"use client";

export default function PrintButton({ supportUrl }: { supportUrl?: string | null }) {
    if (!supportUrl) {
        // Affiche seulement le bouton principal
        return (
            <div className="article__print-block">
                <button className="article__print-button" onClick={() => window.print()}>
                    🖨️ Imprimer cet article
                </button>
            </div>
        );
    }

    return (
        <div className="article__print-block">
            <button className="article__print-button" onClick={() => window.print()}>
                🖨️ Imprimer cet article
            </button>
            <a
                className="article__print-support"
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                ➡️ Imprimer la fiche à colorier et découper
            </a>
        </div>
    );
}
