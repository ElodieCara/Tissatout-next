"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Drawing } from "@/types/drawing";
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import DrawingBreadcrumb from "./components/DrawingBreadcrumb/DrawingBreadcrumb";
import ShareActions from "@/components/ShareActions/ShareActions";
import ExplorerBanner from "../explorer/components/ExplorerBanner";

interface SiteSettings {
    coloringBanner: string;
    coloringTitle: string;
    coloringDesc: string;
}

export default function DrawingPage({ drawing }: { drawing: Drawing }) {
    const [localLikes, setLocalLikes] = useState<number>(drawing.likes ?? 0);
    const [liked, setLiked] = useState(false);
    const [pageUrl, setPageUrl] = useState<string | null>(null);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        // Récupération des settings depuis l'API
        fetch("/api/site-settings")
            .then((res) => res.json())
            .then((data) => setSettings(data))
            .catch((err) => console.error("Erreur lors de la récupération des settings :", err));
    }, []);

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
            <div className="explorer-content">
                <div className="explorer-banner-wrapper">
                    <ExplorerBanner
                        title="Imprime, colorie, recommence !"
                        description="Offrez à votre enfant un moment de calme, de créativité… et de fierté !
                    Téléchargez nos coloriages gratuitement et imprimez-les à volonté."
                    />
                    <Button href="/coloriages/explorer" className="cta-button">
                        Explorer d’autres dessins
                    </Button>
                </div>

            </div>
            <div className="drawing-page">
                <DrawingBreadcrumb category={drawing.category?.name} drawingTitle={drawing.title} />

                <div className="drawing-page__header">
                    <h1 className="drawing-page__title">{drawing.title}</h1>
                    <p className="drawing-page__views">👀 {drawing.views} vues</p>
                </div>

                <div className="drawing-page__main">
                    <div className="drawing-page__image-container">
                        <Image src={drawing.imageUrl} alt={drawing.title} width={600} height={600} className="drawing-page__image" priority />
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

                        <div className="drawing-page__button">
                            <Button className="large" variant="primary" onClick={handlePrint}>Imprimer</Button>
                            <Button className="small" variant="secondary" onClick={handleDownload}>Télécharger</Button>
                        </div>
                        <ShareActions imageUrl={drawing.imageUrl} title={drawing.title} />
                    </div>
                </div>
            </div>
        </>
    );
}
