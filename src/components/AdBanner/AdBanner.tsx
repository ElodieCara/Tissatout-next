// src/components/AdBanner/AdBanner.tsx
"use client";

import { useEffect, useState } from "react";

interface AdBannerProps {
    className?: string;
}

export default function AdBanner({ className = "" }: AdBannerProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setTimeout(() => setIsLoaded(true), 1500); // Simule le chargement
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className={`adsense ${className}`}>
            {!isLoaded && <div className="ad-skeleton" />}
            <ins
                className="adsbygoogle"
                style={{ display: isLoaded ? "block" : "none" }}
                data-ad-client="ca-pub-XXXXXXX"
                data-ad-slot="YYYYYYY"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
