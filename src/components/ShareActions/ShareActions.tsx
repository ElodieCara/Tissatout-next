"use client";

import { FaFacebook, FaPinterest } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

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
            `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}`,
            "_blank"
        );
    };

    const goToInstagram = () => {
        window.open("https://www.instagram.com/tissatout", "_blank"); // mets ton compte ici
    };

    return (
        <div className="product__share">
            <button onClick={shareOnFacebook} aria-label="Partager sur Facebook">
                <FaFacebook />
            </button>
            <button onClick={shareOnPinterest} aria-label="Partager sur Pinterest">
                <FaPinterest />
            </button>
            <button onClick={goToInstagram} aria-label="Voir sur Instagram">
                <FaInstagram />
            </button>
        </div>
    );
}
