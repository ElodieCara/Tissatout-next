"use client";

import { FaFacebook, FaPinterest, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // pour l'icône X (Twitter)

interface ShareActionsProps {
    imageUrl: string;
    title: string;
}

export default function ShareActions({ imageUrl, title }: ShareActionsProps) {
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";

    const shareOnFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
            "_blank"
        );
    };

    const shareOnPinterest = () => {
        window.open(
            `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(title)}`,
            "_blank"
        );
    };

    const shareOnWhatsApp = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + pageUrl)}`, "_blank");
    };

    const shareByEmail = () => {
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(pageUrl)}`, "_blank");
    };

    const shareOnX = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`, "_blank");
    };

    return (
        <div className="product__share">
            <button onClick={shareOnFacebook} aria-label="Partager sur Facebook">
                <FaFacebook />
            </button>
            <button onClick={shareOnPinterest} aria-label="Partager sur Pinterest">
                <FaPinterest />
            </button>
            <button onClick={shareOnWhatsApp} aria-label="Partager sur WhatsApp">
                <FaWhatsapp />
            </button>
            <button onClick={shareByEmail} aria-label="Partager par Email">
                <FaEnvelope />
            </button>
            <button onClick={shareOnX} aria-label="Partager sur X (ancien Twitter)">
                <FaXTwitter />
            </button>
        </div>
    );
}
