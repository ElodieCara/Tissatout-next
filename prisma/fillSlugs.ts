import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils"; // Maintenant dispo !

async function main() {
    const drawings = await prisma.drawing.findMany();

    for (const drawing of drawings) {
        if (!drawing.slug) { // Vérifie si le slug est vide ou null
            const slug = generateSlug(drawing.title, drawing.id);
            await prisma.drawing.update({
                where: { id: drawing.id },
                data: { slug },
            });
        }
    }

    console.log("✅ Tous les slugs ont été remplis !");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
