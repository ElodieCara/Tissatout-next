import { getArticleBySlug } from "@/lib/articles";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import type { Article } from "@/types/home";
import PrintButton from "@/components/PrintButton/PrintButton";
import ArticleFeedback from "./ArticleFeedback";
import CommentList from "./CommentList";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const article = await getArticleBySlug(params.slug);
    if (!article) return { title: "Article introuvable" };
    return { title: article.title };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const article = await getArticleBySlug(params.slug);

    if (!article) return notFound();

    return (
        <main className="article">
            <div className="article__container">

                {/* Âges concernés */}
                {article.ageCategories?.length > 0 && (
                    <div className="article__badges">
                        {article.ageCategories.map((ac: any) => (
                            <span key={ac.ageCategory.id} className="article__badge">
                                {ac.ageCategory.title}
                            </span>
                        ))}
                    </div>
                )}

                {/* Icône de catégorie */}
                {article.iconSrc && (
                    <Image
                        src={article.iconSrc}
                        alt="Icône de catégorie"
                        width={40}
                        height={40}
                        className="article__icon"
                    />
                )}

                {/* Titre */}
                <h1 className="article__title">{article.title}</h1>

                {/* Description */}
                {article.description && (
                    <p className="article__description">{article.description}</p>
                )}

                {/* Métadonnées */}
                <p className="article__meta">
                    {article.date
                        ? `Publié le ${new Date(article.date).toLocaleDateString("fr-FR")}`
                        : "Date inconnue"}{" "}
                    par {article.author}
                </p>

                {/* Image principale */}
                {article.image && (
                    <Image
                        src={article.image}
                        alt={article.title}
                        width={600}
                        height={400}
                        className="article__image"
                    />
                )}

                {/* Sections dynamiques */}
                {article.sections?.length > 0 && (
                    <div className="article__sections">
                        {article.sections.map((section, index) => (
                            <section key={index} className="article__section">
                                {section.title && (
                                    <h2 className="article__section-title">{section.title}</h2>
                                )}
                                <div className="article__section-content">
                                    <ReactMarkdown
                                        components={{
                                            h2: ({ node, ...props }) => <h2 className="article__section-content__md-h2" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="article__section-content__md-h3" {...props} />,
                                            p: ({ node, ...props }) => <p className="article__section-content__md-p" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="article__section-content__md-ul" {...props} />,
                                            li: ({ node, ...props }) => <li className="article__section-content__md-li" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="article__section-content__md-strong" {...props} />,
                                            em: ({ node, ...props }) => <em className="article__section-content__md-em" {...props} />,
                                        }}
                                    >
                                        {section.content}
                                    </ReactMarkdown>
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {/* 🧭 Pour aller plus loin */}
                {article.relatedArticles?.length > 0 && (
                    <div className="article__related">
                        <h2 className="article__related-title">🧭 Pour aller plus loin</h2>
                        <div className="article__related-list">
                            {article.relatedArticles.map((related) => (
                                <a
                                    key={related.id}
                                    href={`/articles/${related.slug}`}
                                    className="article__related-card"
                                >
                                    <div className="article__related-icon">📎</div>
                                    <div className="article__related-title-text">{related.title}</div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}


                {/* Bloc "À imprimer" */}
                <PrintButton supportUrl={article.printableSupport || undefined} />

                {/* Tags */}
                {article.tags?.length > 0 && (
                    <div className="article__tags">
                        <p className="article__tags-title">Tags :</p>
                        <ul className="article__tag-list">
                            {article.tags.map((tag, index) => (
                                <li key={index} className="article__tag">
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* 💬 Section Commentaire */}
            <ArticleFeedback articleId={article.id} />
            <CommentList articleId={article.id} />

        </main>
    );
}
