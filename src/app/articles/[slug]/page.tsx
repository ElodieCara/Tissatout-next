import { getArticleBySlug } from "@/lib/articles";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import PrintButton from "@/components/PrintButton/PrintButton";
import ArticleFeedback from "./ArticleFeedback";
import CommentList from "./CommentList";
import TableOfContents from "./TableOfContents";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import AdBanner from "@/components/AdBanner/AdBanner";

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const article = await getArticleBySlug(params.slug);
    if (!article) return { title: "Article introuvable" };
    return { title: article.title };
}

export default async function ArticlePage({ params }: Props) {
    const article = await getArticleBySlug(params.slug);
    if (!article) return notFound();

    const sections = (article.sections as { title: string; content: string; style?: string }[]) || [];

    let classiqueIndex = 0;
    const processedSections = sections.map((section) => {
        const raw = section.style;
        const normalizedStyle =
            typeof raw === "string" && ["highlight", "icon"].includes(raw.toLowerCase())
                ? raw.toLowerCase()
                : "classique";

        const index = normalizedStyle === "classique" ? ++classiqueIndex : undefined;

        return { ...section, normalizedStyle, index };
    });

    return (
        <>
            <header className="article-banner">

                <div className="article-banner__background">
                    <Image
                        src={article.image || "/images/banniere-generique.jpg"}
                        alt="Image article"
                        fill
                        className="article-banner__blur"
                    />
                </div>

                <div className="article-banner__container">

                    <div className="article-banner__image">
                        <Image
                            src={article.image || "/images/banniere-generique.jpg"} alt={article.title}
                            width={400}
                            height={400}
                        />
                    </div>

                    <div className="article-banner__content">
                        <h1 className="article-banner__title">{article.title}</h1>
                        {article.ageCategories?.length > 0 && (
                            <p className="article-banner__age">
                                🌼{" "}
                                {article.ageCategories
                                    .map((ac: any) => ac.ageCategory.title)
                                    .join(" – ")}
                            </p>
                        )}
                        {article.description && (
                            <p className="article-banner__description">{article.content}</p>
                        )}
                        <div className="article-banner__buttons">
                            <Button href="/inspiration" variant="yellow-button">
                                Voir tous les articles
                            </Button>

                            <PrintButton />
                        </div>
                    </div>

                </div>
            </header>

            <main className="article print-article" >
                <div className="article__container">
                    <div className="no-print">
                        <Breadcrumb
                            crumbs={[
                                { label: "Accueil", href: "/" },
                                { label: "Articles", href: "/inspiration" },
                                { label: article.title }
                            ]}
                        />
                    </div>
                    <header className="article__header">
                        <div className="article__top">
                            <a href="/inspiration" className="article__back-button">
                                ← Voir tous les articles
                            </a>

                            {article.ageCategories?.length > 0 && (
                                <div className="article__badges">
                                    {article.ageCategories.map((ac: any) => (
                                        <span key={ac.ageCategory.id} className="article__badge">
                                            {ac.ageCategory.title}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="article__title-block">
                            {article.iconSrc && (
                                <Image
                                    src={article.iconSrc}
                                    alt="Icône de catégorie"
                                    width={48}
                                    height={48}
                                    className="article__icon"
                                />
                            )}
                            <h1 className="article__title">{article.title}</h1>
                        </div>

                        {article.description && (
                            <p className="article__description">{article.description}</p>
                        )}
                        <p className="article__meta">
                            {article.date
                                ? `Publié le ${new Date(article.date).toLocaleDateString("fr-FR")}`
                                : "Date inconnue"}
                            {article.author && ` par ${article.author}`}
                        </p>
                    </header>

                    {article.image && (
                        <div className="article__grid">
                            <div className="article__grid-image">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    width={800}
                                    height={500}
                                    className="article__image"
                                />
                            </div>

                            <aside className="article__grid-summary">
                                <TableOfContents sections={article.sections} />
                                {/* 🔸 Pub AdSense en-dessous du sommaire, mais hors du bloc article__grid */}
                                <AdBanner className="adsense--top no-print" />
                            </aside>

                        </div>
                    )}


                    <section className="article__sections-grid">
                        {processedSections.map((section, i) => {
                            const className = `article__section article__section--${section.normalizedStyle}`;

                            return (
                                <article key={i} className={className}>
                                    <div className="article__section-header">
                                        {section.normalizedStyle === "icon" && (
                                            <span className="article__section-icon">
                                                <img src="/icons/loupe.png" alt="Icône section" />
                                            </span>
                                        )}
                                        {section.normalizedStyle === "highlight" && null}

                                        <h2 className="article__section-title">
                                            {section.index !== undefined && `${section.index}. `}
                                            {section.title}
                                        </h2>
                                    </div>

                                    {/* Contenu markdown */}
                                    <div className="article__section-content">
                                        <ReactMarkdown
                                            components={{
                                                h2: ({ node, ...props }) => <h2 className="md-h2" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="md-h3" {...props} />,
                                                p: ({ node, ...props }) => <p className="md-p" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="md-ul" {...props} />,
                                                li: ({ node, ...props }) => <li className="md-li" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="md-strong" {...props} />,
                                                em: ({ node, ...props }) => <em className="md-em" {...props} />,
                                            }}
                                        >
                                            {section.content}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Lien d'impression uniquement pour "highlight" */}
                                    {section.normalizedStyle === "highlight" && article.printableSupport && (
                                        <a
                                            href={article.printableSupport}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="article__print-link no-print"
                                        >
                                            📄 Imprimer les supports
                                        </a>
                                    )}
                                </article>
                            );
                        })}
                    </section>

                    {/* 🔗 Articles liés */}
                    {
                        article.relatedArticles?.length > 0 && (
                            <section className="article__related">
                                <h2 className="article__related-title">🧭 Pour aller plus loin</h2>
                                <div className="article__related-list">
                                    {article.relatedArticles.map((related) => (
                                        <a
                                            key={related.id}
                                            href={`/articles/${related.slug}`}
                                            className="article__related-card"
                                        >
                                            <span className="article__related-icon">📎</span>
                                            <span className="article__related-title-text">{related.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )
                    }

                    <div className="article__print">
                        <PrintButton />
                    </div>

                    {
                        article.tags?.length > 0 && (
                            <section className="article__tags">
                                <h3 className="article__tags-title">Mots-clés :</h3>
                                <ul className="article__tag-list">
                                    {article.tags.map((tag, index) => (
                                        <li key={index} className="article__tag">
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )
                    }
                    <div className="no-print">
                        <ArticleFeedback articleId={article.id} />
                        <CommentList articleId={article.id} />
                    </div>
                </div>
            </main >
        </>
    );
}
