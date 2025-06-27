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
import type { Metadata } from "next";
import { getRandomSuggestions } from "@/lib/suggestions";
import SuggestionsForParents from "@/components/SuggestionsForParents/SuggestionsForParents";
import NewsletterBanner from "@/components/NewsletterBanner/NewsletterBanner";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const idea = await prisma.idea.findUnique({ where: { slug: params.slug } });

    if (!idea) return { title: "Idée non trouvée" };

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

type Props = {
    params: { slug: string };
};

// 🔥 Définition du type Section
type Section = {
    id: string;
    title: string;
    content: string;
    style: string | null;
    imageUrl?: string | null;
};


export default async function IdeaPage({ params }: Props) {
    const { slug } = await params;

    const idea = await prisma.idea.findUnique({
        where: { slug },
        include: {
            ageCategories: { include: { ageCategory: true } },
            sections: true,
            relatedLinks: {
                include: {
                    toIdea: true,
                },
            },
            relatedArticles: { // 🔥 Ajout ici
                include: {
                    toArticle: true,
                },
            },
        },
    });

    if (!idea) {
        notFound();
    }

    const suggestions = await getRandomSuggestions("idees", 4, {
        excludeId: idea.id,
        ageCategoryIds: idea.ageCategories.map(ac => ac.ageCategoryId),
    });

    console.log("📥 Articles liés récupérés :", idea.relatedArticles);

    return (
        <>
            {/* 🖼️ Bandeau principal */}
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
                            <Image
                                src={idea.image}
                                alt={idea.title}
                                width={400}
                                height={400}
                            />
                        </div>
                    )}
                    <div className="idea-banner__content">
                        <h2 className="idea-banner__title">{idea.title || "Illustration de l’idée"}</h2>
                        {idea.theme && (
                            <p className="idea-banner__theme">🌟 {idea.theme}</p>
                        )}
                        {idea.description && (
                            <p className="idea-banner__description">{idea.description}</p>
                        )}
                        <div className="idea-banner__buttons">
                            <PrintButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* 🧱 Contenu principal */}
            <main className="idea print-idea">
                <div className="idea__container">

                    {/* 🧭 Fil d'Ariane */}
                    <div className="no-print">
                        <Breadcrumb
                            crumbs={[
                                { label: "Accueil", href: "/" },
                                { label: "Idées", href: "/inspiration" },
                                { label: idea.title },
                            ]}
                        />
                    </div>

                    {/* 🔥 Wrapper flex */}
                    <div className="idea__body">

                        {/* 🧱 Colonne gauche = Contenu principal */}
                        <div className="idea__main">
                            <h1 className="idea__title">{idea.title}</h1>

                            <div className="idea__share">
                                <ShareActions imageUrl={idea.image || ""} title={idea.title} />
                            </div>

                            {/* ➡️ Boucle sur toutes les sections */}
                            {idea.sections?.map((section: Section) => (
                                <section
                                    key={section.id}
                                    id={section.title.replace(/\s+/g, "-").toLowerCase()}
                                    className={`idea__section ${section.style || "classique"}`}
                                >
                                    <div className="idea__separator">
                                        <span>{section.title}</span>
                                    </div>

                                    {section.imageUrl && (
                                        <div className="idea__section-image">
                                            <Image src={section.imageUrl} alt={section.title} width={600} height={400} />
                                        </div>
                                    )}
                                    <ReactMarkdown>{section.content}</ReactMarkdown>
                                </section>
                            ))}

                        </div>

                        {/* 📚 Colonne droite = Sommaire + Pour aller plus loin */}
                        <aside className="idea__sidebar">
                            <div className="idea__toc">
                                <TableOfContents
                                    sections={[...idea.sections.map((section) => ({
                                        title: section.title,
                                        id: section.title.replace(/\s+/g, "-").toLowerCase(),
                                    }))]}
                                />
                            </div>

                            <section className="idea__related">
                                <h2 className="idea__related-title">🔎 Pour aller plus loin</h2>
                                <p>Découvre d'autres idées inspirantes !</p>

                                <div className="idea__related-list">
                                    {idea.relatedArticles && idea.relatedArticles.length > 0 ? (
                                        idea.relatedArticles.map((relation) => (
                                            <a
                                                key={relation.toArticle.id}
                                                href={`/articles/${relation.toArticle.slug}`}
                                                className="idea__related-item"
                                            >
                                                <div className="idea__related-card">
                                                    {relation.toArticle.image && (
                                                        <img
                                                            src={relation.toArticle.image}
                                                            alt={relation.toArticle.title}
                                                            className="idea__related-image"
                                                        />
                                                    )}
                                                    <h3 className="idea__related-name">{relation.toArticle.title}</h3>
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

                    {/* 💬 Et toi, qu'en as-tu pensé ? */}
                    <section className="idea__comments no-print">
                        <ArticleFeedback resourceType="idea" resourceId={idea.id} />
                        <CommentList resourceType="idea" resourceId={idea.id} />
                    </section>

                    {/* 📰 Newsletter */}
                    <section className="idea__newsletter no-print">
                        <NewsletterBanner />
                    </section>

                    {/* 👉 Suggestions */}
                    <section className="idea__suggestions no-print">
                        <SuggestionsForParents items={suggestions} />
                    </section>

                </div>
                <BackToTop />
            </main>
        </>
    );
}
