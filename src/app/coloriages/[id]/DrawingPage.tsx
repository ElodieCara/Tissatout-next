"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Drawing } from "@/types/drawing";
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import DrawingBreadcrumb from "./components/DrawingBreadcrumb/DrawingBreadcrumb";

export default function DrawingPage({ drawing }: { drawing: Drawing }) {
    const [localLikes, setLocalLikes] = useState<number>(drawing.likes ?? 0);
    const [liked, setLiked] = useState(false);
    const [pageUrl, setPageUrl] = useState<string | null>(null);

    // ✅ Vérification si on est côté client avant d'utiliser window
    useEffect(() => {
        if (typeof window !== "undefined") {
            setPageUrl(window.location.href);
        }
    }, []);

    useEffect(() => {
        const storedLikes = localStorage.getItem(`drawing_likes_${drawing.id}`);
        if (storedLikes) {
            setLocalLikes(storedLikes ? parseInt(storedLikes, 10) : 0);
            setLiked(true);
        }
    }, [drawing.id]);

    /** ✅ Fonction de Like */
    const handleLike = async () => {
        if (liked) return;

        try {
            // Mise à jour optimiste
            const newLikes = localLikes + 1;
            setLocalLikes(newLikes);
            setLiked(true);

            // Sauvegarde dans localStorage
            localStorage.setItem(`drawing_likes_${drawing.id}`, newLikes.toString());

            const res = await fetch("/api/drawings/like", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: drawing.id }),
            });

            if (!res.ok) throw new Error("Échec du like");

            const data = await res.json();
            console.log("Réponse API like:", data);

            // Mettre à jour avec la valeur réelle
            setLocalLikes(data.likes);
            localStorage.setItem(`drawing_likes_${drawing.id}`, data.likes.toString());
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
                <DrawingBreadcrumb category={drawing.category?.name} drawingTitle={drawing.title} />

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
                            <Link href={`https://www.pinterest.com/pin/create/button/?url=${pageUrl ? encodeURIComponent(pageUrl) : ''}`} target="_blank">
                                <Image src="/icons/sociale.png" alt="Pinterest" width={32} height={32} />
                            </Link>

                            <Link href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl ? encodeURIComponent(pageUrl) : ''}`} target="_blank">
                                <Image src="/icons/facebook.png" alt="Facebook" width={32} height={32} />
                            </Link>

                            <Link href={`mailto:?subject=Regarde ce coloriage !&body=${pageUrl ? encodeURIComponent(pageUrl) : ''}`}>
                                <Image src="/icons/email.png" alt="Email" width={32} height={32} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
