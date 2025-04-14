import { getArticleBySlug } from "@/lib/articles"; // à adapter selon ton projet

export default async function Head({ params }: { params: { slug: string } }) {
    const article = await getArticleBySlug(params.slug);
    if (!article) return null;

    const {
        title,
        description,
        image,
        author,
        slug,
        date,
    } = article;

    const url = `https://tissatout.fr/articles/${slug}`;
    const ogImage = image || "https://tissatout.fr/default-article.jpg";
    const articleDescription = description || "Un article à lire sur Tissatout.";

    return (
        <>
            {/* 🧠 SEO de base */}
            <title>{title} | Article | Tissatout</title>
            <meta name="description" content={articleDescription} />
            <meta name="robots" content="index, follow" />

            {/* 🔗 Canonical */}
            <link rel="canonical" href={url} />

            {/* 📘 Open Graph */}
            <meta property="og:type" content="article" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={articleDescription} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="Tissatout" />
            <meta property="article:published_time" content={new Date(date).toISOString()} />
            <meta property="og:locale" content="fr_FR" />

            {/* 🐦 Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={articleDescription} />
            <meta name="twitter:image" content={ogImage} />

            {/* 🔍 Rich Snippet JSON-LD */}
            <script type="application/ld+json" suppressHydrationWarning>
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    mainEntityOfPage: {
                        "@type": "WebPage",
                        "@id": url,
                    },
                    headline: title,
                    description: articleDescription,
                    image: [ogImage],
                    datePublished: new Date(date).toISOString(),
                    author: {
                        "@type": "Person",
                        name: author || "L’équipe Tissatout",
                    },
                    publisher: {
                        "@type": "Organization",
                        name: "Tissatout",
                        logo: {
                            "@type": "ImageObject",
                            url: "https://tissatout.fr/logo-og.png", // ton logo pour les rich snippets
                        },
                    },
                })}
            </script>
        </>
    );
}
