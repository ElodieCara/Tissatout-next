"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";

export default function DrawingPage() {
    const params = useParams();
    const [drawing, setDrawing] = useState<Drawing | null>(null);
    const [error, setError] = useState<string | null>(null);

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
            } catch (err) {
                console.error("Erreur fetchDrawing:", err);
                setError("Erreur réseau");
            }
        };

        fetchDrawing();
    }, [params?.id]);

    if (error) {
        return <p>Erreur : {error}</p>;
    }

    return (
        <div>
            {drawing ? (
                <DrawingCard
                    id={drawing.id}
                    imageUrl={drawing.imageUrl}
                    theme={drawing.title}
                    views={drawing.views ?? 0}
                    likes={drawing.likes ?? 0}
                />
            ) : (
                <p>Chargement du coloriage...</p>
            )}
        </div>
    );
}
