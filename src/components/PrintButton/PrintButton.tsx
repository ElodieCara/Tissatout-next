"use client";
import { useState } from "react";

export default function PrintButton({ articleImageUrl }: { articleImageUrl?: string }) {
    const [includeImage, setIncludeImage] = useState(true);

    const handlePrint = () => {
        const body = document.body;

        if (!includeImage) {
            body.classList.add("no-image-print");
        }

        window.print();

        // Nettoyer après impression
        setTimeout(() => {
            body.classList.remove("no-image-print");
        }, 1000);
    };

    return (
        <div className="article__print-block">
            <label className="article__print-checkbox">
                <input
                    type="checkbox"
                    checked={includeImage}
                    onChange={(e) => setIncludeImage(e.target.checked)}
                />
                Inclure l’image ?
            </label>

            <button className="article__print-button" onClick={handlePrint}>
                🖨️ Imprimer cet article
            </button>
        </div>
    );
}
