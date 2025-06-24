"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Loading() {
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    if (!showLoading) {
        return null;
    }

    return (
        <div className="loading">
            <Image
                src="/loader/tissatoupi-fly.png"
                alt="Tissatoupi charge la page"
                width={90}
                height={90}
                className="bird"
            />
            <p>Chargement en cours...</p>
        </div>
    );
}
