import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "../Button/Button";

type SlideshowProps = {
    images: {
        id?: string | number;
        imageUrl: string;
        title: string;
        description: string;
        buttonText?: string;
        buttonLink?: string;
    }[];
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

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 🛡️ Sécurité : si aucune image, on ne rend rien
    if (images.length === 0) return null;
    const current = images[currentSlide];

    // ⏳ Effet pour l'auto-défilement
    useEffect(() => {
        if (isPaused || images.length <= 1) return;

        const tick = () => {
            setCurrentSlide(prev => {
                setPreviousSlide(prev);
                setDirection("left"); // défilement auto => l’ancienne sort à gauche
                return (prev + 1) % images.length;
            });
        };

        intervalRef.current = setInterval(tick, interval);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [images.length, interval, isPaused]);

    // Nettoyage previousSlide après la transition CSS (0.5s)
    useEffect(() => {
        if (previousSlide !== null) {
            const t = setTimeout(() => setPreviousSlide(null), 500);
            return () => clearTimeout(t);
        }
    }, [previousSlide]);

    const nextSlide = () => {
        setPreviousSlide(currentSlide);
        setDirection("left");
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setPreviousSlide(currentSlide);
        setDirection("right");
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        if (index === currentSlide) return;
        setPreviousSlide(currentSlide);
        setDirection(index > currentSlide ? "left" : "right");
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

    if (!images[currentSlide] || !images[currentSlide].imageUrl) return null;

    return (
        <div className="container__slide"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="container__slide__image-wrapper">
                {images.map((image, index) => (
                    <Image
                        key={index}
                        src={image.imageUrl}
                        alt={image.title || `Slide ${index + 1}`}
                        fill
                        priority={index === 0}
                        className={`container__slide__image ${index === currentSlide ? "active" : ""
                            } ${previousSlide !== null && index === previousSlide
                                ? direction === "left"
                                    ? "slide-left"
                                    : "slide-right"
                                : ""
                            }`}
                        style={{ objectFit: "cover" }}
                        loading={index === 0 ? "eager" : "lazy"}
                        quality={75}
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
                        key={slide.id ?? idx}
                        className={`dot ${idx === currentSlide ? "active" : ""}`}
                        onClick={() => goToSlide(idx)}
                    >
                        <Image
                            src={
                                idx === currentSlide
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
                {current.title && <h1>{current.title}</h1>}
                {current.description && <p>{current.description}</p>}
                {current.buttonText && current.buttonLink && (
                    <a href={current.buttonLink}>
                        <Button className="button large">{current.buttonText}</Button>
                    </a>
                )}
            </div>
        </div>
    );
};

export default Slideshow;
