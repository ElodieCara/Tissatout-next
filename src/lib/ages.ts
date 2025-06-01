import prisma from "@/lib/prisma";

export async function getAllAgeCategories() {
    return await prisma.ageCategory.findMany({
        orderBy: { title: "asc" },
        select: {
            id: true,
            title: true,
            slug: true,
            imageCard: true,     // -> ton image centrale
            imageBanner: true,   // ou une autre si besoin
        },
    });
}
