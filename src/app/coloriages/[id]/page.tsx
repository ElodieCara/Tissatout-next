"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Drawing } from "@/types/drawing";
import DrawingBreadcrumb from "./components/DrawingBreadcrumb/DrawingBreadcrumn";
import DrawingSidebar from "./components/DrawingSidebar/DrawingSidebar";
import Banner from "@/components/Banner/Banner";

export default function DrawingPage() {
    const params = useParams();
    const router = useRouter();
    const [localLikes, setLocalLikes] = useState<number>(0);
    const [liked, setLiked] = useState(false);
    const [drawing, setDrawing] = useState<Drawing | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [prevDrawing, setPrevDrawing] = useState<Drawing | null>(null);
    const [nextDrawing, setNextDrawing] = useState<Drawing | null>(null);

    useEffect(() => {
        if (!params?.id) return;

        const fetchDrawing = async () => {
            try {
                const res = await fetch(`/api/drawings/${params.id}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    setError(errorData.error || "Erreur inconnue lors du fetch");
                    return;
                }
                const data = await res.json();
                setDrawing(data);
                setLocalLikes(data.likes);

                // Charger les dessins précédent et suivant
                const resAdjacent = await fetch(`/api/drawings/adjacent?category=${encodeURIComponent(data.category.name)}&currentId=${data.id}`);
                const adjacentData = await resAdjacent.json();
                setPrevDrawing(adjacentData.prev || null);
                setNextDrawing(adjacentData.next || null);
            } catch (err) {
                console.error("Erreur fetchDrawing:", err);
                setError("Erreur réseau");
            }
        };

        fetchDrawing();
    }, [params?.id]);

    /** ✅ Télécharger l'image directement */
    const handleDownload = () => {
        if (!drawing?.imageUrl) return;

        const link = document.createElement("a");
        link.href = drawing.imageUrl;
        link.download = `${drawing.title.replace(/\s+/g, "_") || "coloriage"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /** ✅ Impression propre de l'image */
    const handlePrint = () => {
        if (!drawing?.imageUrl) return;

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
                        <script>
                            window.onload = function() { window.print(); };
                            window.onafterprint = function() { window.close(); };
                            setTimeout(() => { window.close(); }, 5000);
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    /** ✅ Fonction de Like */
    const handleLike = async () => {
        if (liked || !drawing?.id) return;

        try {
            const res = await fetch("/api/drawings", {
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

    if (error) return <p className="drawing-page--error">Erreur : {error}</p>;

    return (
        <>
            <Banner src="/assets/slide3.png"
                title="💡 Inspiration & Conseils"
                description="Trouvez des idées d'activités et des conseils adaptés à chaque saison et moment clé du développement !" />

            <div className="drawing-page">
                {/* ✅ Fil d'Ariane */}
                {drawing && <DrawingBreadcrumb category={drawing.category?.name} drawingTitle={drawing.title} />}

                <div className="drawing-page__layout">
                    {/* ✅ Sidebar à gauche */}
                    {drawing?.category && (
                        <aside className="drawing-page__sidebar">
                            <DrawingSidebar category={drawing.category.name} currentDrawingId={drawing.id} />
                        </aside>
                    )}

                    {/* ✅ Contenu principal */}
                    <div className="drawing-page__content">
                        {drawing ? (
                            <>
                                {/* 🔹 Titre et vues */}
                                <div className="drawing-page__header">
                                    <h1 className="drawing-page__title">{drawing.title}</h1>
                                    <p className="drawing-page__views">👁️ {drawing.views} vues</p>
                                </div>

                                <div className="drawing-page__main">
                                    {/* 🖼️ Image avec cadre */}
                                    <div className="drawing-page__image-container">
                                        <Image src={drawing.imageUrl} alt={drawing.title} width={400} height={400} className="drawing-page__image" priority />
                                    </div>

                                    {/* ✅ Actions à droite */}
                                    <div className="drawing-page__actions">

                                        {/* ✅ Bouton Like */}
                                        <button className="drawing-page__like-button" onClick={handleLike} disabled={liked}>
                                            <span className={`drawing-page__heart-icon ${liked ? "liked" : ""}`}>
                                                {liked ? "❤️" : "🤍"}
                                            </span>
                                            <span className="drawing-page__likes-count">{localLikes}</span>
                                        </button>

                                        {/* ✅ Description SEO */}
                                        <div className="drawing-page__description">
                                            <p>Découvrez ce magnifique coloriage **{drawing.title}**, idéal pour les enfants et les amateurs d’illustrations créatives.
                                                Ce dessin à imprimer fait partie de la catégorie **{drawing.category?.name}**, parfaite pour stimuler l'imagination et la motricité fine.</p>
                                        </div>

                                        <button className="drawing-page__button" onClick={handlePrint}>🖨️ Imprimer</button>
                                        <button className="drawing-page__button" onClick={handleDownload}>⬇️ Télécharger</button>

                                        {/* ✅ Boutons de partage */}
                                        <div className="drawing-page__share">
                                            <span>Partager :</span>
                                            <Link href={`https://www.pinterest.com/pin/create/button/?url=${window.location.href}&media=${drawing.imageUrl}`} target="_blank">📌 Pinterest</Link>
                                            <Link href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank">📘 Facebook</Link>
                                            <Link href={`mailto:?subject=Regarde ce coloriage !&body=${window.location.href}`}>✉️ Email</Link>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="drawing-page__loading">Chargement du coloriage...</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
