"use client";
import { useState } from "react";
import Button from "../Button/Button";

export default function PrintButton() {
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
        <div className="article__print">
            <Button variant="red-button" onClick={handlePrint}>
                🖨️ Imprimer cet article
            </Button>

            <div className="article__print-options">
                <label htmlFor="includeImage" className="article__print-checkbox">
                    <input
                        id="includeImage"
                        type="checkbox"
                        checked={includeImage}
                        onChange={(e) => setIncludeImage(e.target.checked)}
                    />
                    <span>Inclure l’image ?</span>
                </label>
            </div>
        </div>
    );
}
