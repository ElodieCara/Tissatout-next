import { useState } from "react";
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
};


const Slideshow: React.FC<SlideshowProps> = ({ images }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // 🛡️ Sécurité : si aucune image, on ne rend rien
    if (images.length === 0) return null;

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const ballons = [
        { plein: "/assets/ballon-jaune-plein.png", vide: "/assets/ballon-jaune-vide.png" },
        { plein: "/assets/ballon-rouge-plein.png", vide: "/assets/ballon-rouge-vide.png" },
        { plein: "/assets/ballon-bleu-plein.png", vide: "/assets/ballon-bleu-vide.png" },
    ];

    if (!images[currentSlide] || !images[currentSlide].imageUrl) return null;

    const current = images[currentSlide];

    return (
        <div className="container__slide">
            <div className="container__slide__image">
                <Image
                    src={images[currentSlide].imageUrl}
                    alt={`Slide ${currentSlide + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                    quality={100}
                    sizes="100vw"
                />

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
