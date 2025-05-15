import { useState, useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
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
    const [fade, setFade] = useState(true);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 🛡️ Sécurité : si aucune image, on ne rend rien
    if (images.length === 0) return null;

    // ⏳ Effet pour l'auto-défilement
    useEffect(() => {
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                setFade(false);
                setTimeout(() => {
                    setCurrentSlide((prev) => (prev + 1) % images.length);
                    setFade(true);
                }, 300); // ⏳ Le temps de l'animation (0.3s)
            }, interval);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [images.length, interval, isPaused]);


    const nextSlide = () => {
        setFade(false);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
            setFade(true);
        }, 300);
    };

    const prevSlide = () => {
        setFade(false);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
            setFade(true);
        }, 300);
    };

    const goToSlide = (index: number) => {
        setFade(false);
        setTimeout(() => {
            setCurrentSlide(index);
            setFade(true);
        }, 300);
    };

    const handleMouseEnter = () => {
        setIsPaused(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };
    const ballons = [
        { plein: "/assets/ballon-jaune-plein.png", vide: "/assets/ballon-jaune-vide.png" },
        { plein: "/assets/ballon-rouge-plein.png", vide: "/assets/ballon-rouge-vide.png" },
        { plein: "/assets/ballon-bleu-plein.png", vide: "/assets/ballon-bleu-vide.png" },
    ];

    if (!images[currentSlide] || !images[currentSlide].imageUrl) return null;

    const current = images[currentSlide];

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
                        alt={`Slide ${index + 1}`}
                        fill
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
                        sizes="100vw"
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
