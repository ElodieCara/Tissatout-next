import { sections } from "@/data/home";

export default function Head({ params }: { params: { slug: string } }) {
    const section = sections.find((s) => encodeURIComponent(s.slug) === params.slug);

    if (!section) return null;

    return (
        <>
            <title>{section.title} | Nos Univers</title>
            <meta name="description" content={section.description} />
            <meta property="og:title" content={`${section.title} | Nos Univers`} />
            <meta property="og:description" content={section.description} />
        </>
    );
}
