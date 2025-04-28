import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { getPrintableBySlug, getSimilarPrintables } from "@/lib/printables";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import BackToTop from "@/components/BackToTop/BackToTop";
import PrintableGallery from "./PrintableGallery";
import LikeButton from "./LikeButton";
import ShareActions from "../../../components/ShareActions/ShareActions";

type Props = {
    params: { slug: string };
};

type GameThemeSafe = {
    theme: { label: string } | null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const printable = await getPrintableBySlug(params.slug);
    if (!printable) return { title: "Fiche introuvable" };

    return {
        title: printable.title,
        description: printable.description || "Fiche éducative à imprimer pour enfants – Tissatout",
    };
}

export default async function PrintablePage({ params }: Props) {
    const printable = await getPrintableBySlug(params.slug);
    if (!printable) return notFound();

    const similar = await getSimilarPrintables(
        printable.id,
        printable.ageMin,
        printable.ageMax,
        printable.themes.map((t: any) => t.theme?.label).filter(Boolean)
    );

    const extraImages = printable.extraImages?.map(e => e.imageUrl) || [];

    return (
        <>
            {/* <header className="printable-banner">
                <div className="printable-banner__container">
                    <div className="printable-banner__image">
                        <Image
                            src={printable.imageUrl}
                            alt={printable.title}
                            width={400}
                            height={400}
                        />
                    </div>

                    <div className="printable-banner__content">
                        <h1>{printable.title}</h1>
                        <p className="printable-banner__age">
                            🎯 Pour les {printable.ageMin}–{printable.ageMax} ans
                        </p>
                        {printable.description && (
                            <p className="printable-banner__description">{printable.description}</p>
                        )}
                    </div>
                </div>
            </header> */}

            <main className="printable">
                <div className="printable__container">
                    <Breadcrumb
                        crumbs={[
                            { label: "Accueil", href: "/" },
                            { label: "Activités à imprimer", href: "/activites-a-imprimer" },
                            { label: printable.title },
                        ]}
                    />

                    <div className="product">
                        <PrintableGallery
                            images={[printable.imageUrl, ...extraImages]}
                            alt={printable.title}
                        />

                        <div className="product__info">

                            <div className="product__title-wrapper">
                                <h1 className="product__title">{printable.title}</h1>
                            </div>
                            <div className="product__age">
                                {printable.ageMin}–{printable.ageMax} ans
                            </div>

                            {/* Bloc PDF */}
                            {printable.pdfUrl && typeof printable.pdfPrice === "number" && (
                                <>
                                    <div className="product__price">
                                        {printable.pdfPrice === 0 ? (
                                            <span className="product__price-free">
                                                Gratuit <span className="product__price-note">(PDF)</span>
                                            </span>
                                        ) : (
                                            <>
                                                <span className="product__price-main">
                                                    {Math.floor(printable.pdfPrice)}
                                                </span>
                                                <span className="product__price-cents">
                                                    ,{(printable.pdfPrice % 1).toFixed(2).split(".")[1]} €
                                                </span>
                                                <small className="product__price__tax-note">Prix TTC</small>
                                            </>
                                        )}
                                    </div>

                                    <div className="product__actions">
                                        <a
                                            className="product__download"
                                            href={printable.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            📄 {printable.pdfPrice === 0 ? "Télécharger gratuitement" : "Acheter le PDF"}
                                        </a>
                                        <LikeButton id={printable.id} />
                                    </div>
                                </>
                            )}


                            {/* Bloc Plastifié */}
                            {typeof printable.printPrice === "number" && printable.printUrl ? (
                                <>
                                    <div className="product__price">
                                        <span className="product__price-main">
                                            {Math.floor(printable.printPrice)}
                                        </span>
                                        <span className="product__price-cents">
                                            ,{(printable.printPrice % 1).toFixed(2).split(".")[1]} €
                                        </span>
                                        <span className="product__price-note"> (PDF)</span>
                                    </div>
                                    <a
                                        className="product__download"
                                        href={printable.printUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        🛒 Commander sur Etsy
                                    </a>
                                </>
                            ) : (
                                <div className="product__note">🟡 Version plastifiée bientôt disponible</div>
                            )}

                            <div className="product__share">
                                <p className="product__share-text">
                                    🧡 Tu aimes cette fiche ? <strong>Partage-la</strong> avec d'autres parents ou enseignants :
                                </p>
                                <ShareActions imageUrl={printable.imageUrl} title={printable.title} />
                            </div>

                            <div className="product__description">
                                <h2>Description</h2>
                                <p>{printable.description}</p>
                            </div>

                            {(printable.themes?.length || printable.types?.length) > 0 && (
                                <div className="product__tags">
                                    {printable.themes?.map((t, i) =>
                                        t.theme ? (
                                            <span className="product__tag" key={`theme-${i}`}>
                                                {t.theme.label}
                                            </span>
                                        ) : null
                                    )}
                                    {printable.types?.map((t, i) =>
                                        t.type ? (
                                            <span className="product__tag" key={`type-${i}`}>
                                                {t.type.label}
                                            </span>
                                        ) : null
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {printable.previewImageUrl && (
                        <section className="printable__content">
                            <h2>Aperçu de la fiche</h2>
                            <Image
                                src={printable.previewImageUrl}
                                alt={`Aperçu de ${printable.title}`}
                                width={700}
                                height={1000}
                                className="printable__preview-image"
                            />
                        </section>
                    )}

                    {printable.themes?.length > 0 && (
                        <section className="printable__tags">
                            <h3>Thèmes associés</h3>
                            <ul className="printable__tag-list">
                                {printable.themes.map((t: GameThemeSafe, i: number) =>
                                    t.theme ? <li key={i}>{t.theme.label}</li> : null
                                )}
                            </ul>
                        </section>
                    )}
                </div>
                <div className="activites__separator">
                    <span> Et si on prolongeait l’aventure ? 👇</span>
                </div>
                {similar.length > 0 && (
                    <section className="printable__similar">
                        <p className="printable__similar-intro">
                            Ces activités pourraient aussi plaire à votre enfant :
                        </p>
                        <h3>🎒 Activités similaires</h3>
                        <ul className="printable__similar-list">
                            {similar.map((s) => (
                                <li key={s.id} className="printable__similar-card">
                                    <a href={`/activites-a-imprimer/${s.slug}`}>
                                        <Image
                                            src={s.imageUrl}
                                            alt={s.title}
                                            width={200}
                                            height={140}
                                            className="printable__similar-image"
                                        />
                                        <span className="printable__similar-title">{s.title}</span>
                                        <span className="printable__similar-age">
                                            {s.ageMin}–{s.ageMax} ans
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <BackToTop />
            </main>
        </>
    );
}
