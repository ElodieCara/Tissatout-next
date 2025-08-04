import AgePage from "./AgePage";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
    const slug = params.slug;

    if (typeof slug !== "string") {
        throw new Error("Le slug doit être une chaîne valide.");
    }

    console.log("📌 Slug reçu :", slug);
    const ageCategory = await prisma.ageCategory.findUnique({
        where: { slug },
        include: {
            articles: { include: { article: true } },
            drawings: { include: { drawing: true } },
            advices: {
                include: { advice: true },
                orderBy: {
                    advice: {
                        createdAt: "desc"
                    }
                }
            },
            ideas: { include: { idea: true } },
        },
    });

    if (!ageCategory) return notFound();
    const siteSettings = await prisma.siteSettings.findFirst();
    const agePageBanner = siteSettings?.agePageBanner || "/assets/slide3.png";

    return <AgePage ageCategory={ageCategory} agePageBanner={agePageBanner} />;
}
