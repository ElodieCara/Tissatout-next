"use client";

import { useState, useEffect } from "react";
import Slideshow from "../Slideshow/Slideshow";
import Loading from "@/app/nos-univers/loading";

interface HomeSlide {
    id?: string;
    imageUrl: string;
    title: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
}

const SlideLoader = () => {
    const [slides, setSlides] = useState<HomeSlide[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            setLoading(true);

            try {
                const response = await fetch("/api/home-slides", { cache: "no-store" });
                const data: HomeSlide[] = await response.json();

                // 🔍 Filtrer les slides invalides
                const cleaned = data
                    .filter((s) =>
                        s &&
                        typeof s.imageUrl === "string" &&
                        s.imageUrl.trim() !== "" &&
                        typeof s.title === "string" &&
                        typeof s.description === "string"
                    )

                // 🔄 Suppression des doublons
                const unique = cleaned.filter((s, index, self) =>
                    index === self.findIndex(t => t.id === s.id)
                );

                setSlides(unique);
            } catch (error) {
                console.error("❌ Erreur lors du chargement des slides :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    if (loading) {
        return (
            <div className="slideshow__loader">
                <Loading />
            </div>
        );
    }

    return <Slideshow images={slides} />;
};

export default SlideLoader;
