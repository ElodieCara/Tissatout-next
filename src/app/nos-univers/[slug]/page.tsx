import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function AgePage({ params }: { params: Promise<{ slug: string }> }) {
    // 🔥 Attendre la résolution des `params`
    const resolvedParams = await params;

    console.log("📌 Params résolus :", resolvedParams);

    if (!resolvedParams?.slug) {
        console.error("❌ Erreur : Slug manquant dans les paramètres.");
        return notFound();
    }

    console.log("🔍 Slug reçu :", resolvedParams.slug);

    // Récupération de la catégorie d'âge en fonction du slug
    const ageCategory = await prisma.ageCategory.findUnique({
        where: { slug: resolvedParams.slug },
        include: {
            articles: { include: { article: true } },
            drawings: { include: { drawing: true } },
            advices: { include: { advice: true } },
            ideas: { include: { idea: true } }
        }
    });

    if (!ageCategory) {
        console.error(`⚠️ Aucun ageCategory trouvé pour le slug : ${resolvedParams.slug}`);
        return notFound();
    }

    console.log("✅ Catégorie d'âge trouvée :", ageCategory);

    return (
        <div>
            <header>
                <Image
                    src={ageCategory.imageBanner || "/images/default-banner.jpg"}
                    alt={ageCategory.title}
                    width={1200}
                    height={400}
                    priority
                />
                <h1>{ageCategory.title}</h1>
                <p>{ageCategory.description}</p>
            </header>

            {/* 🔹 Liste des coloriages */}
            <section>
                <h2>🎨 Coloriages</h2>
                <div>
                    {ageCategory.drawings?.length > 0 ? (
                        ageCategory.drawings.map(({ drawing }) => (
                            <Link key={drawing.id} href={`/coloriages/${drawing.slug}`}>
                                <Image
                                    src={drawing.imageUrl || "/images/placeholder.jpg"}
                                    alt={drawing.title}
                                    width={150}
                                    height={150}
                                />
                                <p>{drawing.title}</p>
                            </Link>
                        ))
                    ) : (
                        <p>Aucun coloriage disponible.</p>
                    )}
                </div>
            </section>

            {/* 🔹 Liste des articles */}
            <section>
                <h2>📚 Articles</h2>
                <ul>
                    {ageCategory.articles?.length > 0 ? (
                        ageCategory.articles.map(({ article }) => (
                            <li key={article.id}>
                                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                            </li>
                        ))
                    ) : (
                        <p>Aucun article disponible.</p>
                    )}
                </ul>
            </section>
        </div>
    );
}
