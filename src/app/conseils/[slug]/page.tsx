import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import TableOfContents from "@/components/TableOfContents/TableOfContents";
import PrintButton from "@/components/PrintButton/PrintButton";
import CommentList from "@/components/CommentList/CommentList";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ReactMarkdown from "react-markdown";
import ArticleFeedback from "@/components/Feedback/Feedback";
import BackToTop from "@/components/BackToTop/BackToTop";
import ShareActions from "@/components/ShareActions/ShareActions";
import NewsletterBanner from "@/components/NewsletterBanner/NewsletterBanner";
import SuggestionsForParents from "@/components/SuggestionsForParents/SuggestionsForParents";
import { getRandomSuggestions } from "@/lib/suggestions";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

type AdviceSection = {
    id: string;
    title: string;
    content: string;
    style?: string | null;
    imageUrl?: string | null;
};

type RelatedAdvice = {
    toAdvice: { id: string; slug: string; title: string; imageUrl?: string | null };
};

type RelatedArticle = {
    toArticle: { id: string; slug: string; title: string; image?: string | null };
};

type RelatedColoring = {
    toColoring: { id: string; slug: string; title: string; imageUrl?: string | null };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const advice = await prisma.advice.findUnique({
        where: { slug },
        select: { title: true, description: true, imageUrl: true, slug: true },
    });

    if (!advice) return { title: "Conseil introuvable" };

    const title = `${advice.title} | Tissatout`;
    const description = advice.description ?? "Conseil pour parents et enfants.";
    const image = advice.imageUrl ?? "/og-image.jpg";
    const url = `https://www.tissatout.fr/conseils/${advice.slug}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title: advice.title,
            description,
            url,
            siteName: "Tissatout",
            type: "article",
            images: [{ url: image }],
        },
        twitter: {
            card: "summary_large_image",
            title: advice.title,
            description,
            images: [image],
        },
    };
}

export default async function AdvicePage({ params }: Props) {
    const { slug } = await params;

    const advice = await prisma.advice.findUnique({
        where: { slug: slug },
        include: {
            ageCategories: { include: { ageCategory: true } },
            sections: true,
            relatedFrom: {
                include: {
                    toAdvice: true,
                },
            },
            relatedArticles: {
                include: { toArticle: true },
            },
            relatedColorings: {
                include: { toColoring: true },
            },
        },
    });

    if (!advice) {
        notFound();
    }

    const sections = (advice.sections ?? []) as AdviceSection[];
    const relatedFrom = (advice.relatedFrom ?? []) as RelatedAdvice[];
    const relatedArticles = (advice.relatedArticles ?? []) as RelatedArticle[];
    const relatedColorings = (advice.relatedColorings ?? []) as RelatedColoring[];


    const suggestions = await getRandomSuggestions("conseils", 4);

    return (
        <>
            {/* 🖼️ Bandeau principal */}
            <header className="advice-banner">
                <div className="advice-banner__background">
                    {advice.imageUrl && (
                        <Image
                            src={advice.imageUrl}
                            alt={advice.title}
                            fill
                            className="advice-banner__blur"
                        />
                    )}
                </div>

                <div className="advice-banner__container">
                    {advice.imageUrl && (
                        <div className="advice-banner__image">
                            <Image
                                src={advice.imageUrl}
                                alt={advice.title}
                                width={400}
                                height={400}
                            />
                        </div>
                    )}
                    <div className="advice-banner__content">
                        <h2 className="advice-banner__title">{advice.title}</h2>
                        <div className="advice-banner__category">
                            <img src="/icons/titres/cible.png" alt="Icône thématique"
                                width="36"
                                height="36" />
                            {advice.category && (
                                <p className="advice-banner__category-texte">
                                    {advice.category}</p>
                            )}
                        </div>
                        {advice.description && (
                            <p className="advice-banner__description">{advice.description}</p>
                        )}

                        <div className="advice-banner__buttons">
                            {/* <Button href="/inspiration" variant="yellow-button">
                                Voir tous les articles
                            </Button> */}
                            <PrintButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* 🧱 Contenu principal */}
            <main className="advice print-advice">
                <div className="advice__container">

                    {/* 🧭 Fil d'Ariane */}
                    <div className="no-print">
                        <Breadcrumb
                            crumbs={[
                                { label: "Accueil", href: "/" },
                                { label: "Conseils", href: "/conseils" },
                                { label: advice.title },
                            ]}
                        />
                    </div>

                    {/* 🔥 NOUVEAU : wrapper flex */}
                    <div className="advice__body">

                        {/* 🧱 Colonne gauche = Contenu principal */}
                        <div className="advice__main">
                            <h1 className="advice__title">{advice.title}</h1>

                            <div className="advice__meta">
                                {advice.author && (
                                    <span className="advice__author">Par {advice.author}</span>
                                )}
                                {advice.createdAt && (
                                    <span className="advice__date">
                                        Publié le {new Date(advice.createdAt).toLocaleDateString("fr-FR")}
                                    </span>
                                )}
                            </div>

                            <div className="advice__share">
                                <ShareActions imageUrl={advice.imageUrl || ""} title={advice.title} />
                            </div>

                            {/* Intro éventuelle */}
                            {advice.content && (
                                <section id="intro" className="advice__content">
                                    <ReactMarkdown>{advice.content}</ReactMarkdown>
                                </section>
                            )}

                            {/* ➡️ Boucle sur toutes les sections */}
                            {advice.sections?.map((section: AdviceSection) => (
                                <section
                                    key={section.id}
                                    id={section.title.replace(/\s+/g, "-").toLowerCase()}
                                    className={`advice__section ${section.style || "classique"}`}
                                >
                                    <div className="advice__separator">
                                        <span>{section.title}</span>
                                    </div>

                                    {section.imageUrl && (
                                        <div className="advice__section-image">
                                            <Image src={section.imageUrl} alt={section.title} width={600} height={400} />
                                        </div>
                                    )}
                                    <ReactMarkdown>{section.content}</ReactMarkdown>
                                </section>
                            ))}

                        </div>

                        {/* 📚 Colonne droite = Sommaire + Pour aller plus loin */}
                        <aside className="advice__sidebar">
                            <div className="advice__toc">
                                <TableOfContents
                                    sections={[
                                        { title: "Introduction", id: "intro" },
                                        ...advice.sections.map((section: AdviceSection) => ({
                                            title: section.title,
                                            id: section.title.replace(/\s+/g, "-").toLowerCase(),
                                        })),
                                    ]}
                                />
                            </div>

                            <section className="advice__related">
                                <div className="advice__related-texte">
                                    <img src="/icons/loupe.png" alt="Icône section" width="36"
                                        height="36" />
                                    <h2 className="advice__related-title">Pour aller plus loin</h2>
                                </div>
                                <p>Découvre d&apos;autres conseils pratiques pour t&apos;accompagner !</p>

                                <div className="advice__related-list">
                                    {/* Conseils liés */}
                                    {advice.relatedFrom.length > 0 && (
                                        <section className="advice__related-group">
                                            <h3>📝 Autres conseils</h3>
                                            <div className="advice__related-list">
                                                {advice.relatedFrom.map((r: RelatedAdvice) => (
                                                    <Link className="advice__related-item" key={r.toAdvice.id} href={`/conseils/${r.toAdvice.slug}`}>

                                                        {/* miniature ou placeholder */}
                                                        {r.toAdvice.imageUrl
                                                            ? <Image src={r.toAdvice.imageUrl} width={100} height={70} alt="" />
                                                            : <div className="placeholder">Pas d&apos;image</div>}
                                                        <span>{r.toAdvice.title}</span>

                                                    </Link>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* Articles liés */}
                                    {advice.relatedArticles.length > 0 && (
                                        <section className="advice__related-group">
                                            <h3>📄 Articles liés</h3>
                                            <div className="advice__related-list">
                                                {advice.relatedArticles.map((r: RelatedArticle) => {
                                                    const art = r.toArticle;
                                                    return (
                                                        <Link className="advice__related-item" key={art.id} href={`/articles/${art.slug}`}>

                                                            {art.image
                                                                ? <Image src={art.image} width={100} height={70} alt="" />
                                                                : <div className="placeholder">Pas d&apos;image</div>}
                                                            <span>{art.title}</span>

                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    )}

                                    {/* Coloriages liés */}
                                    {advice.relatedColorings.length > 0 && (
                                        <section className="advice__related-group">
                                            <h3>🖍️ Coloriages liés</h3>
                                            <div className="advice__related-list">
                                                {advice.relatedColorings.map((r: RelatedColoring) => {
                                                    const col = r.toColoring;
                                                    return (
                                                        <Link className="advice__related-item" key={col.id} href={`/coloriages/${col.slug}`}>

                                                            {col.imageUrl
                                                                ? <Image src={col.imageUrl} width={100} height={70} alt="" />
                                                                : <div className="placeholder">Pas d&apos;image</div>}
                                                            <span>{col.title}</span>

                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    )}

                                </div>
                            </section>

                        </aside>

                    </div>

                    {/* 💬 Et toi, qu'en as-tu pensé ? */}
                    <section className="comments no-print">
                        <ArticleFeedback resourceType="advice" resourceId={advice.id} />
                        <CommentList resourceType="advice" resourceId={advice.id} />
                    </section>

                    <section className=" no-print">
                        <NewsletterBanner />
                    </section>

                    <section className="no-print">
                        <SuggestionsForParents items={suggestions} />
                    </section>

                </div>
                <BackToTop />
            </main>

        </>
    );
}