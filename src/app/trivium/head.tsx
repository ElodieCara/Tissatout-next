export default function Head() {
    const title = "Trivium | Apprendre à penser comme les Anciens";
    const description =
        "Explore le Trivium pour enfants : Grammaire, Logique et Rhétorique à travers des leçons claires, illustrées et inspirantes.";
    const ogImage = "https://tissatout.fr/trivium-og.jpg";
    const url = "https://tissatout.fr/trivium";

    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={url} />

            {/* Open Graph (Facebook, LinkedIn, etc.) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="Tissatout" />
            <meta property="og:locale" content="fr_FR" />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json" suppressHydrationWarning>
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "EducationalOccupationalProgram",
                    name: "Trivium",
                    description: description,
                    educationalLevel: "Primary",
                    provider: {
                        "@type": "Organization",
                        name: "Tissatout",
                        url: url,
                    },
                    image: ogImage,
                    url: url,
                })}
            </script>
        </>
    );
}
