// src/app/ideas/[slug]/page.tsx
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
import { getRandomSuggestions } from "@/lib/suggestions";
import SuggestionsForParents from "@/components/SuggestionsForParents/SuggestionsForParents";
import NewsletterBanner from "@/components/NewsletterBanner/NewsletterBanner";
import type { Metadata } from "next";
import Link from "next/link";

type Props = {
    params: { slug: string };
};

type Section = {
    id: string;
    title: string;
    content: string;
    style: string | null;
    imageUrl?: string | null;
    coloring?: {
        id: string;
        title: string;
        slug: string;
        imageUrl?: string;
    } | null;
    activity?: {
        id: string;
        title: string;
        slug: string;
        imageUrl?: string;
    } | null;
};

type IdeaWithRelations = {
    id: string;
    title: string;
    description?: string;
    theme?: string;
    image?: string;
    slug: string;
    sections: Section[];
    ageCategories: {
        ageCategory: {
            id: string;
            title: string;
            slug: string;
            imageBanner: string;
        };
    }[];
    relatedArticles: {
        toArticle: {
            id: string;
            title: string;
            slug: string;
            image?: string;
        };
    }[];
    relatedLinks: {
        toIdea: {
            id: string;
            title: string;
            slug: string;
        };
    }[];
    relatedColorings: {
        toColoring: {
            id: string;
            title: string;
            slug: string;
            image?: string;
        };
    }[];
    relatedActivities: {
        toActivity: {
            id: string;
            title: string;
            slug: string;
            imageUrl?: string;
        };
    }[];
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const idea = await prisma.idea.findUnique({ where: { slug: params.slug } });

    if (!idea) {
        return { title: "Idée non trouvée" };
    }

    return {
        title: `${idea.title} | Tissatout`,
        description: idea.description || "Idée d’activité pour enfants.",
        openGraph: {
            title: idea.title,
            description: idea.description || "",
            images: idea.image ? [{ url: idea.image }] : [],
        },
    };
}

export default async function IdeaPage({ params }: Props) {
    const idea = await prisma.idea.findUnique({
        where: { slug: params.slug },
        include: {
            ageCategories: { include: { ageCategory: true } },
            relatedLinks: { include: { toIdea: true } },
            relatedArticles: { include: { toArticle: true } },

            // Sections avec leurs coloriages et activités liés
            sections: {
                include: {
                    coloring: true,  // Drawing lié via coloringId
                    activity: true   // Activity lié via activityId
                }
            },

            // Relations M2M pour compatibilité
            relatedColorings: { include: { toColoring: true } },
            relatedActivities: { include: { toActivity: true } },
        },
    });

    if (!idea) notFound();
    const ideaTyped = idea as unknown as IdeaWithRelations;

    const suggestions = await getRandomSuggestions("idees", 4, {
        excludeId: idea.id,
        ageCategoryIds: ideaTyped.ageCategories.map(ac => ac.ageCategory.id),
    });

    return (
        <>
            <header className="idea-banner">
                <div className="idea-banner__background">
                    {idea.image && (
                        <Image
                            src={idea.image}
                            alt={idea.title}
                            fill
                            className="idea-banner__blur"
                        />
                    )}
                </div>
                <div className="idea-banner__container">
                    {idea.image && (
                        <div className="idea-banner__image">
                            <Image src={idea.image} alt={idea.title} width={400} height={400} />
                        </div>
                    )}
                    <div className="idea-banner__content">
                        <h2 className="idea-banner__title">{idea.title}</h2>
                        {idea.theme && <p className="idea-banner__theme">🌟 {idea.theme}</p>}
                        {idea.description && (
                            <p className="idea-banner__description">{idea.description}</p>
                        )}
                        <div className="idea-banner__buttons">
                            <PrintButton />
                        </div>
                    </div>
                </div>
            </header>

            <main className="idea print-idea">
                <div className="idea__container">
                    <div className="no-print">
                        <Breadcrumb
                            crumbs={[
                                { label: "Accueil", href: "/" },
                                { label: "Idées", href: "/inspiration" },
                                { label: idea.title },
                            ]}
                        />
                    </div>

                    <div className="idea__body">
                        <div className="idea__main">
                            <h1 className="idea__title">{idea.title}</h1>
                            <div className="idea__share">
                                <ShareActions imageUrl={idea.image || ""} title={idea.title} />
                            </div>

                            {ideaTyped.sections.map(section => {
                                console.log('section.activity', section.activity);
                                return (
                                    <section
                                        key={section.id}
                                        id={section.title.replace(/\s+/g, "-").toLowerCase()}
                                        className={`idea__section ${section.style || "classique"}`}
                                    >
                                        <div className="idea__separator">
                                            <span>{section.title}</span>
                                        </div>
                                        <div className="idea__section-content">
                                            {section.imageUrl && (
                                                <div className="idea__section-image">
                                                    <Image
                                                        src={section.imageUrl}
                                                        alt={section.title}
                                                        width={600}
                                                        height={400}
                                                    />
                                                </div>
                                            )}


                                            {/* 🖍️ Coloriage associé à la section */}
                                            {section.coloring && (
                                                <div className="idea__related-item center-btn">
                                                    <Link href={`/coloriages/${section.coloring.slug}`}>
                                                        <button
                                                            type="button"
                                                            className=" button red-button "
                                                        >
                                                            Voir le coloriage
                                                        </button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                        {section.activity && (
                                            <div className="idea__related-item center-btn">
                                                <h4>🧩 Activité associée</h4>
                                                <Link href={`/activites-a-imprimer/${section.activity.slug}`}>

                                                    <button className="button red-button">
                                                        Voir l’activité associée
                                                    </button>

                                                </Link>
                                            </div>
                                        )}

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

                                    </section>
                                )
                            })}
                        </div>

                        <aside className="idea__sidebar">
                            <div className="idea__toc">
                                <TableOfContents
                                    sections={ideaTyped.sections.map(section => ({
                                        title: section.title,
                                        id: section.title.replace(/\s+/g, "-").toLowerCase(),
                                    }))}
                                />
                            </div>

                            <section className="idea__related">
                                <h2 className="idea__related-title">🔎 Pour aller plus loin</h2>
                                <p>Découvre d'autres idées inspirantes !</p>
                                <div className="idea__related-list">
                                    {ideaTyped.relatedArticles.length > 0 ? (
                                        ideaTyped.relatedArticles.map(({ toArticle }) => (
                                            <a
                                                key={toArticle.id}
                                                href={`/articles/${toArticle.slug}`}
                                                className="idea__related-item"
                                            >
                                                <div className="idea__related-card">
                                                    {toArticle.image && (
                                                        <img
                                                            src={toArticle.image}
                                                            alt={toArticle.title}
                                                            className="idea__related-image"
                                                        />
                                                    )}
                                                    <h3 className="idea__related-name">
                                                        {toArticle.title}
                                                    </h3>
                                                </div>
                                            </a>
                                        ))
                                    ) : (
                                        <p>Aucune idée supplémentaire pour l’instant.</p>
                                    )}
                                </div>
                            </section>
                        </aside>
                    </div>

                    <section className="idea__comments no-print">
                        <ArticleFeedback resourceType="idea" resourceId={idea.id} />
                        <CommentList resourceType="idea" resourceId={idea.id} />
                    </section>

                    <section className="idea__newsletter no-print">
                        <NewsletterBanner />
                    </section>

                    <section className="idea__suggestions no-print">
                        <SuggestionsForParents items={suggestions} />
                    </section>
                </div>
                <BackToTop />
            </main >
        </>
    );
}
