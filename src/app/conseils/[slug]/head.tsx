import type { Metadata } from "next";
import prisma from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const advice = await prisma.advice.findUnique({
        where: { slug: params.slug },
        select: { title: true, description: true, slug: true, imageUrl: true },
    });

    if (!advice) {
        return { title: "Conseil introuvable", description: "Ce conseil n'existe pas ou a été supprimé." };
    }

    const url = `https://www.tonsite.com/conseils/${advice.slug}`;
    const image = advice.imageUrl || "https://www.tonsite.com/images/banniere-generique.jpg";

    return {
        title: advice.title,
        description: advice.description || "Découvre un conseil malin pour progresser avec Tissatout !",
        openGraph: {
            title: advice.title,
            description: advice.description || "Découvre un conseil malin pour progresser avec Tissatout !",
            url,
            images: [{ url: image }],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: advice.title,
            description: advice.description || "Découvre un conseil malin pour progresser avec Tissatout !",
            images: [image],
        },
    };
}
