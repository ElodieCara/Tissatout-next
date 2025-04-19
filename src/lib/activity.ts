import prisma from "@/lib/prisma";

export async function getAllActivities() {
    return await prisma.printableGame.findMany({
        include: {
            themes: {
                include: { theme: true }
            },
            types: {
                include: { type: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
}

