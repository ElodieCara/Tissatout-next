import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import Button from "../Button/Button";


type SlideshowProps = {
    images: {
        id: number;
        image: string | StaticImageData;
    }[];
    title?: string;
    subtitle?: string;
    description?: string;
    buttonLabel?: string;
};

const Slideshow: React.FC<SlideshowProps> = ({ images, title, subtitle, description, buttonLabel }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

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

    return (
        <div className="container__slide">
            <div className="container__slide__image">

                <Image
                    src={images[currentSlide].image}
                    alt={`Slide ${currentSlide + 1}`}
                    style={{ width: "100%", height: "auto" }}
                    priority={true} // Priorité de chargement pour la première image
                />
                {/* Ajout de la boule rouge */}

                {/* <RedBtn /> */}

            </div>
            <div className="container__slide__buttons">
                <Image
                    className="container__slide__buttons__arrow--prev"
                    src="/assets/arrow-circle-right.png"
                    alt="Précédent"
                    width={50}
                    height={50}
                    onClick={prevSlide}
                    priority={true}
                />
                <Image
                    className="container__slide__buttons__arrow--next"
                    src="/assets/arrow-circle-left.png"
                    alt="Suivant"
                    width={50}
                    height={50}
                    onClick={nextSlide}
                    priority={true}
                />
            </div>
            <div className="container__slide__pagination">
                {images.map((_, idx) => (
                    <span
                        key={idx}
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
                {title && <h1>{title}</h1>}
                {subtitle && <h2>{subtitle}</h2>}
                {description && <p>{description}</p>}
                <p><strong>Prêts à explorer ?</strong> Découvrez nos dernières idées et amusez-vous avec vos enfants ! </p>
                {buttonLabel && <Button className="button large">{buttonLabel}</Button>}
            </div>

        </div>

    );
};

export default Slideshow;
