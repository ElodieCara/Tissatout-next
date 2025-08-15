"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Button from "../Button/Button";

type Slide = {
    id?: string | number;
    imageUrl: string;
    title: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
};

type SlideshowProps = {
    images: Slide[];
    title?: string;
    subtitle?: string;
    description?: string;
    buttonLabel?: string;
    interval?: number;
};

const Slideshow: React.FC<SlideshowProps> = ({ images, interval = 5000 }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [previousSlide, setPreviousSlide] = useState<number | null>(null);
    const [direction, setDirection] = useState<"left" | "right">("left");
    const [isPaused, setIsPaused] = useState(false);

    // Compat navigateur/Node pour TS
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const hasImages = images && images.length > 0;
    const safeIndex = hasImages ? Math.min(currentSlide, images.length - 1) : 0;
    const current = hasImages ? images[safeIndex] : undefined;

    // ⏳ Auto-défilement (garde **dans** le hook)
    useEffect(() => {
        if (!hasImages || isPaused || images.length <= 1) return;

        const tick = () => {
            setCurrentSlide((prev) => {
                setPreviousSlide(prev);
                setDirection("left"); // auto => l’ancienne sort à gauche
                return (prev + 1) % images.length;
            });
        };

        intervalRef.current = setInterval(tick, interval);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [hasImages, images.length, interval, isPaused]);

    // ✅ Garde *après* les hooks (rendu) : pas d’images valides, on ne rend rien
    if (!hasImages || !current?.imageUrl) return null;

    // Nettoyage de previousSlide après la transition CSS (0.5s)
    useEffect(() => {
        if (previousSlide === null) return;
        const t = setTimeout(() => setPreviousSlide(null), 500);
        return () => clearTimeout(t);
    }, [previousSlide]);

    const nextSlide = () => {
        if (!hasImages) return;
        setPreviousSlide(safeIndex);
        setDirection("left");
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        if (!hasImages) return;
        setPreviousSlide(safeIndex);
        setDirection("right");
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        if (!hasImages || index === safeIndex) return;
        setPreviousSlide(safeIndex);
        setDirection(index > safeIndex ? "left" : "right");
        setCurrentSlide(index);
    };

    const handleMouseEnter = () => {
        setIsPaused(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
    const handleMouseLeave = () => setIsPaused(false);

    const ballons = [
        { plein: "/assets/ballon-jaune-plein.png", vide: "/assets/ballon-jaune-vide.png" },
        { plein: "/assets/ballon-rouge-plein.png", vide: "/assets/ballon-rouge-vide.png" },
        { plein: "/assets/ballon-bleu-plein.png", vide: "/assets/ballon-bleu-vide.png" },
    ];


    return (
        <div
            className="container__slide"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="container__slide__image-wrapper">
                {images.map((image, index) => (
                    <Image
                        key={(image.id ?? index).toString()}
                        src={image.imageUrl}
                        alt={image.title || `Slide ${index + 1}`}
                        fill
                        priority={index === 0}
                        className={`container__slide__image ${index === safeIndex ? "active" : ""
                            } ${previousSlide !== null && index === previousSlide
                                ? direction === "left"
                                    ? "slide-left"
                                    : "slide-right"
                                : ""
                            }`}
                        style={{ objectFit: "cover" }}
                        loading={index === 0 ? "eager" : "lazy"}
                        quality={100}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    />
                ))}
            </div>

            <div className="container__slide__buttons">
                <Image
                    className="container__slide__buttons__arrow--prev"
                    src="/assets/arrow-circle-right.png"
                    alt="Précédent"
                    width={50}
                    height={50}
                    onClick={prevSlide}
                    priority
                />
                <Image
                    className="container__slide__buttons__arrow--next"
                    src="/assets/arrow-circle-left.png"
                    alt="Suivant"
                    width={50}
                    height={50}
                    onClick={nextSlide}
                    priority
                />
            </div>

            <div className="container__slide__pagination">
                {images.map((slide, idx) => (
                    <span
                        key={(slide.id ?? idx).toString()}
                        className={`dot ${idx === safeIndex ? "active" : ""}`}
                        onClick={() => goToSlide(idx)}
                    >
                        <Image
                            src={
                                idx === safeIndex
                                    ? ballons[idx % ballons.length].plein
                                    : ballons[idx % ballons.length].vide
                            }
                            alt={`Ballon ${idx + 1}`}
                            width={30}
                            height={30}
                            className="balloon-icon"
                        />
                    </span>
                ))}
            </div>

            <div className="container__slide__text">
                {current?.title && <h1>{current.title}</h1>}
                {current?.description && <p>{current.description}</p>}
                {current?.buttonText && current?.buttonLink && (
                    <a href={current.buttonLink}>
                        <Button className="button large">{current.buttonText}</Button>
                    </a>
                )}
            </div>
        </div>
    );
};

export default Slideshow;
