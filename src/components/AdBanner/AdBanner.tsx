// src/components/AdBanner/AdBanner.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface AdBannerProps {
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle?: unknown[];
    }
}

export default function AdBanner({ className = "" }: AdBannerProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const pushedOnce = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            window.adsbygoogle = window.adsbygoogle || [];

            if (!pushedOnce.current) {
                window.adsbygoogle.push({});
                pushedOnce.current = true;
            }

            const t = window.setTimeout(() => setIsLoaded(true), 800);
            return () => window.clearTimeout(t);
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
