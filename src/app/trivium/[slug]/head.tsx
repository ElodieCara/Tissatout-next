import { getLessonBySlug } from "@/lib/lessons";

export default async function Head({ params }: { params: { slug: string } }) {
    const lesson = await getLessonBySlug(params.slug);

    if (!lesson) return null;

    const {
        title,
        summary,
        image,
        chapterTitle,
        personageName,
        personageDates,
        slug,
    } = lesson;

    const description = summary || `Une leçon du Trivium pour éveiller les esprits curieux.`;
    const ogImage = image || "https://tissatout.fr/default-og-image.jpg";

    return (
        <>
            {/* SEO de base */}
            <title>{title} | Trivium | Tissatout</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow" />

            {/* Open Graph (Facebook, LinkedIn) */}
            <meta property="og:type" content="article" />
            <meta property="og:title" content={`${title} | Trivium | Tissatout`} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={`https://tissatout.fr/trivium/${slug}`} />
            <meta property="og:site_name" content="Tissatout" />
            <meta property="og:locale" content="fr_FR" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD (rich results) */}
            <script type="application/ld+json" suppressHydrationWarning>
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "EducationalOccupationalProgram",
                    name: title,
                    description,
                    educationalLevel: "Primary",
                    hasCourse: {
                        "@type": "Course",
                        name: chapterTitle || "Leçon du Trivium",
                    },
                    teaches: personageName
                        ? `${personageName}${personageDates ? ` (${personageDates})` : ""}`
                        : undefined,
                    provider: {
                        "@type": "Organization",
                        name: "Tissatout",
                        url: "https://tissatout.fr",
                    },
                    image: ogImage,
                    url: `https://tissatout.fr/trivium/${slug}`,
                })}
            </script>
        </>
    );
}
