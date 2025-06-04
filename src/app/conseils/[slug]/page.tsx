import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import TableOfContents from "@/components/TableOfContents/TableOfContents";
import PrintButton from "@/components/PrintButton/PrintButton";
import CommentList from "@/components/CommentList/CommentList";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ReactMarkdown from "react-markdown";
import ArticleFeedback from "@/app/articles/[slug]/ArticleFeedback";
import BackToTop from "@/components/BackToTop/BackToTop";
import ShareActions from "@/components/ShareActions/ShareActions";

type Props = {
    params: { slug: string };
};

export default async function AdvicePage({ params }: Props) {
    const advice = await prisma.advice.findUnique({
        where: { slug: params.slug },
        include: {
            ageCategories: { include: { ageCategory: true } },
            sections: true,
            relatedFrom: { // ✅ AJOUTER ÇA
                include: {
                    toAdvice: true,
                },
            },
        },
    });

    if (!advice) {
        notFound();
    }

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
                        {advice.category && (
                            <p className="advice-banner__category">🎯 {advice.category}</p>
                        )}
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
                            {advice.sections?.map((section) => (
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
                                        ...advice.sections.map((section) => ({
                                            title: section.title,
                                            id: section.title.replace(/\s+/g, "-").toLowerCase(),
                                        })),
                                    ]}
                                />
                            </div>

                            <section className="advice__related">
                                <h2 className="advice__related-title">🔎 Pour aller plus loin</h2>
                                <p>Découvre d'autres conseils pratiques pour t'accompagner !</p>

                                <div className="advice__related-list">
                                    {advice.relatedFrom && advice.relatedFrom.length > 0 ? (
                                        advice.relatedFrom.map((relation) => (
                                            relation.toAdvice ? (
                                                <a
                                                    key={relation.toAdvice.id}
                                                    href={`/conseils/${relation.toAdvice.slug}`}
                                                    className="advice__related-item"
                                                >
                                                    <div className="advice__related-card">
                                                        {relation.toAdvice.imageUrl ? (
                                                            <img
                                                                src={relation.toAdvice.imageUrl}
                                                                alt={relation.toAdvice.title}
                                                                className="advice__related-image"
                                                            />
                                                        ) : (
                                                            <div className="advice__related-placeholder">Image non disponible</div>
                                                        )}
                                                        <h3 className="advice__related-name">{relation.toAdvice.title}</h3>
                                                    </div>
                                                </a>
                                            ) : (
                                                <p>Conseil non trouvé.</p>
                                            )
                                        ))
                                    ) : (
                                        <p>Aucun conseil supplémentaire pour l’instant.</p>
                                    )}
                                </div>
                            </section>

                        </aside>

                    </div>

                    {/* 💬 Et toi, qu'en as-tu pensé ? */}
                    <section className="advice__comments no-print">
                        <ArticleFeedback articleId={advice.id} />
                        <CommentList articleId={advice.id} />
                    </section>

                </div>
                <BackToTop />
            </main>

        </>
    );
}