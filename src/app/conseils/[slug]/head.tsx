import { prisma } from "@/lib/prisma";

interface HeadProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: HeadProps) {
    const advice = await prisma.advice.findUnique({
        where: { slug: params.slug },
    });

    if (!advice) {
        return {
            title: "Conseil introuvable",
            description: "Le conseil demandé est introuvable sur Tissatout.",
        };
    }

    return {
        title: `${advice.title} - Conseil | Tissatout`,
        description: advice.description || "Découvrez nos meilleurs conseils d'éducation !",
    };
}
