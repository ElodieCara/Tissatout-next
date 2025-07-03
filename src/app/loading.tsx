"use client";

import { useGlobalLoading } from "./GlobalLoadingContext";
import Image from "next/image";

export default function Loading() {
    const { isLoading } = useGlobalLoading();

    if (!isLoading) return null;

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
