"use client";

interface DrawingActionsProps {
    imageUrl: string;
    title: string;
}

export default function DrawingActions({ imageUrl, title }: DrawingActionsProps) {
    const handlePrint = () => {
        window.print(); // Simple impression
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `${title}.png`;
        link.click();
    };

    const handleColorOnline = () => {
        console.log("🚀 Rediriger vers l'outil de coloriage en ligne...");
    };

    const shareOnPinterest = () => {
        const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(title)}`;
        window.open(url, "_blank");
    };

    const shareOnFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="drawing-actions">
            <button onClick={handlePrint} className="drawing-actions__button">🖨️ Imprimer</button>
            <button onClick={handleDownload} className="drawing-actions__button">📥 Télécharger</button>
            <button onClick={handleColorOnline} className="drawing-actions__button">🎨 Colorier en ligne</button>
            <button onClick={shareOnPinterest} className="drawing-actions__button">📌 Partager sur Pinterest</button>
            <button onClick={shareOnFacebook} className="drawing-actions__button">📘 Partager sur Facebook</button>
        </div>
    );
}
