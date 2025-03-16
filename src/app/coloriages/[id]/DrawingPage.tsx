"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Drawing } from "@/types/drawing";
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";

export default function DrawingPage({ drawing }: { drawing: Drawing }) {
    const [localLikes, setLocalLikes] = useState<number>(drawing.likes);
    const [liked, setLiked] = useState(false);

    /** ✅ Fonction de Like */
    const handleLike = async () => {
        if (liked) return;

        try {
            const res = await fetch("/api/drawings/like", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: drawing.id }),
            });

            if (!res.ok) throw new Error("Échec du like");

            const data = await res.json();
            setLocalLikes(data.likes);
            setLiked(true);
        } catch (error) {
            console.error("❌ Erreur lors du like :", error);
        }
    };

    /** ✅ Télécharger l'image */
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = drawing.imageUrl;
        link.download = `${drawing.title.replace(/\s+/g, "_")}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /** ✅ Impression propre */
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Impression - Tissatout</title>
                        <style>
                            @page { margin: 0; } 
                            body { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif; }
                            img { max-width: 100%; height: auto; }
                            .footer { margin-top: 10px; font-size: 14px; color: #555; }
                        </style>
                    </head>
                    <body>
                        <img src="${drawing.imageUrl}" alt="Coloriage à imprimer"/>
                        <div class="footer">Imprimé depuis Tissatout</div>
                        <script> window.onload = function() { window.print(); window.close(); }; </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <>
            <Banner src="/assets/slide3.png"
                title="💡 Inspiration & Conseils"
                description="Trouvez des idées d'activités et des conseils adaptés à chaque saison et moment clé du développement !" />

            <div className="drawing-page">
                <div className="drawing-page__header">
                    <h1 className="drawing-page__title">{drawing.title}</h1>
                    <p className="drawing-page__views">👀 {drawing.views} vues</p>
                </div>

                <div className="drawing-page__main">
                    <div className="drawing-page__image-container">
                        <Image src={drawing.imageUrl} alt={drawing.title} width={400} height={400} className="drawing-page__image" priority />
                    </div>

                    <div className="drawing-page__actions">
                        <button className="drawing-page__like-button" onClick={handleLike} disabled={liked}>
                            <span className={`drawing-page__heart-icon ${liked ? "liked" : ""}`}>
                                {liked ? "❤️" : "🤍"}
                            </span>
                            <span className="drawing-page__likes-count">{localLikes}</span>
                        </button>

                        <div className="drawing-page__description">
                            <p>Découvrez ce magnifique coloriage **{drawing.title}**, idéal pour les enfants et les amateurs d’illustrations créatives.</p>
                        </div>

                        <Button className="large" variant="primary" onClick={handlePrint}>🖨️ Imprimer</Button>
                        <Button className="large" variant="secondary" onClick={handleDownload}>⬇️ Télécharger</Button>

                        <div className="drawing-page__share">
                            <Link href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}`} target="_blank">
                                <Image src="/icons/sociale.png" alt="Pinterest" width={32} height={32} />
                            </Link>

                            <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank">
                                <Image src="/icons/facebook.png" alt="Facebook" width={32} height={32} />
                            </Link>

                            <Link href={`mailto:?subject=Regarde ce coloriage !&body=${encodeURIComponent(window.location.href)}`}>
                                <Image src="/icons/email.png" alt="Email" width={32} height={32} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
