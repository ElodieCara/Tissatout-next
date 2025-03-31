"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Drawing {
    id: string;
    slug: string;
    title: string;
    imageUrl?: string;
}

interface DrawingSliderProps {
    drawings: Drawing[];
}

export default function DrawingSlider({ drawings }: DrawingSliderProps) {
    const itemsPerPage = 6; // 2 lignes × 3 colonnes
    const totalPages = Math.ceil(drawings.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const currentDrawings = drawings.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    return (
        <div className="drawings__carousel">
            <button
                className="drawings__arrow drawings__arrow--left"
                onClick={handlePrev}
                disabled={currentPage === 0}
            >
                ←
            </button>

            <div className="drawings__grid">
                {currentDrawings.map((drawing) => (
                    <Link
                        key={drawing.id}
                        href={`/coloriages/${drawing.slug}`}
                        className="drawings__card"
                    >
                        <Image
                            src={drawing.imageUrl || "/images/default.jpg"}
                            alt={drawing.title}
                            width={200}
                            height={200}
                        />
                        <h4>{drawing.title}</h4>
                    </Link>
                ))}
            </div>

            <button
                className="drawings__arrow drawings__arrow--right"
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1}
            >
                →
            </button>
        </div>
    );
}
