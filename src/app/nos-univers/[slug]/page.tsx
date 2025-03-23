import AgePage from "./AgePage";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
    const ageCategory = await prisma.ageCategory.findUnique({
        where: { slug: params.slug },
        include: {
            articles: { include: { article: true } },
            drawings: { include: { drawing: true } },
            advices: { include: { advice: true } },
            ideas: { include: { idea: true } },
        },
    });

    if (!ageCategory) return notFound();
    const siteSettings = await prisma.siteSettings.findFirst();
    const agePageBanner = siteSettings?.agePageBanner || "/assets/slide3.png";

    return <AgePage ageCategory={ageCategory} agePageBanner={agePageBanner} />;
}
