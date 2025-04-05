import { getArticleBySlug } from "@/lib/articles";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

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
                                <div
                                    className="article__section-content"
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </section>
                        ))}
                    </div>
                )}

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
        </main>
    );
}
