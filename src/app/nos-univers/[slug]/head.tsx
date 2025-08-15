import prisma from "@/lib/prisma";

export default async function Head({ params }: { params: { slug: string } }) {
    const category = await prisma.ageCategory.findUnique({
        where: { slug: params.slug },
        select: {
            title: true,
            description: true,
            imageBanner: true,
        },
    });

    if (!category) {
        return (
            <>
                <title>Page introuvable | Nos Univers</title>
                <meta name="robots" content="noindex, nofollow" />
            </>
        );
    }

    const baseUrl = "https://www.tissatout.fr";
    const pageUrl = `${baseUrl}/nos-univers/${params.slug}`;

    return (
        <>
            <title>{category.title} | Nos Univers</title>
            <meta name="description" content={category.description} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={pageUrl} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={`${category.title} | Nos Univers`} />
            <meta property="og:description" content={category.description} />
            <meta property="og:url" content={pageUrl} />
            {category.imageBanner && (
                <meta property="og:image" content={`${baseUrl}${category.imageBanner}`} />
            )}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${category.title} | Nos Univers`} />
            <meta name="twitter:description" content={category.description} />
            {category.imageBanner && (
                <meta name="twitter:image" content={`${baseUrl}${category.imageBanner}`} />
            )}
        </>
    );
}
