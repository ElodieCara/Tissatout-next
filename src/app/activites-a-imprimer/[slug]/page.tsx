import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Metadata } from "next";
import { getPrintableBySlug, getSimilarPrintables } from "@/lib/printables";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import BackToTop from "@/components/BackToTop/BackToTop";
import PrintableGallery from "./PrintableGallery";
import LikeButton from "./LikeButton";
import ShareActions from "../../../components/ShareActions/ShareActions";
import ArticleFeedback from "@/components/Feedback/Feedback";
import CommentList from "@/components/CommentList/CommentList";
import MysteryCard from "@/components/MysteryCard/MysteryCard";
import MysteryActivityCard from "../MysteryActivityCard";


type Props = {
    params: { slug: string };
};

type GameThemeSafe = {
    theme: { label: string } | null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const printable = await getPrintableBySlug(slug);
    if (!printable) return { title: "Fiche introuvable" };

    const baseUrl = "https://tissatout.fr"; // 🔁 À ajuster si nécessaire
    const url = `${baseUrl}/activites-a-imprimer/${slug}`;
    const image = printable.imageUrl?.startsWith("http")
        ? printable.imageUrl
        : `${baseUrl}${printable.imageUrl}`;

    return {
        title: printable.title,
        description: printable.description || "Fiche éducative à imprimer pour enfants – Tissatout",
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: printable.title,
            description: printable.description || "Fiche éducative à imprimer",
            type: "article",
            url,
            images: [
                {
                    url: image,
                    width: 800,
                    height: 600,
                    alt: printable.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: printable.title,
            description: printable.description || "Fiche à imprimer pour enfants",
            images: [image],
        },
    };
}

export default async function PrintablePage({ params }: Props) {
    const { slug } = await params;
    const printable = await getPrintableBySlug(slug);
    if (!printable) return notFound();
    const mystery = await prisma.printableGame.findFirst({
        where: { isMystery: true },
    });
    //if (!mystery) return null;

    // 1️⃣ On récupère d’abord tous les similaires
    const similar = await getSimilarPrintables(
        printable.id,
        printable.ageMin,
        printable.ageMax,
        printable.themes.map((t: any) => t.theme?.label).filter(Boolean)
    );

    // 2️⃣ On filtre pour enlever la carte mystère non révélée
    const now = new Date()
    const visibles = similar.filter(s => {
        if (!s.isMystery) return true            // toutes les cartes normales
        if (!s.mysteryUntil) return false         // mystère sans date : on cache
        return new Date(s.mysteryUntil) <= now    // mystère révélé : on garde
    })

    const extraImages = printable.extraImages?.map(e => e.imageUrl) || [];

    console.log("🖼 printable =", printable);
    console.log("🎩 mystery =", mystery);
    console.log("🤝 similar =", similar);
    console.log("👀 visibles =", visibles);

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

                {/* 💬 Et toi, qu'en as-tu pensé ? */}
                <section className="comments no-print mystery">
                    <ArticleFeedback resourceType="printable" resourceId={printable.id} />
                    <CommentList resourceType="printable" resourceId={printable.id} />
                </section>

                <MysteryCard title="Une activité mystérieuse à venir !"
                    description="Une surprise rigolote pour apprendre, réfléchir et t'amuser ! Abonne-toi pour ne rien manquer."
                    imageSrc="/images/activite-mystere-floutee.jpg"
                    alt="Aperçu activité mystère"
                    isRevealed={false}
                    revealDate={mystery?.mysteryUntil ? mystery.mysteryUntil.toISOString() : ""}
                    primaryButtonLink={
                        mystery?.slug
                            ? `/activites-a-imprimer/${mystery.slug}`
                            : "/activites-a-imprimer"
                    } isSubscribed={false}
                    secondaryButtonLink="/newsletter" />

                <div className="activites__separator">
                    <span> Et si on prolongeait l’aventure ? 👇</span>
                </div>
                {visibles.length > 0 && (
                    <section className="printable__similar">
                        <p className="printable__similar-intro">
                            Ces activités pourraient aussi plaire à votre enfant :
                        </p>
                        <h3>🎒 Activités similaires</h3>
                        <ul className="printable__similar-list">
                            {visibles.map((s) => (
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
