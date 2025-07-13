const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const game = await prisma.printableGame.create({
        data: {
            title: "Test fiche à imprimer",
            slug: "test-fiche-imprimer",
            description: "Test automatique pour GET",
            pdfUrl: "/pdfs/test.pdf",
            pdfPrice: 1.99,
            imageUrl: "/uploads/test.png",
            previewImageUrl: null,
            isPrintable: true,
            printPrice: null,
            printUrl: null,
            ageMin: 5,
            ageMax: 8,
            views: 0,
            isFeatured: false,
            isMystery: false,
            mysteryUntil: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            // Les champs de relations (themes/types/extraImages) : vides pour ce test
        },
    });
    console.log("ID à tester:", game.id);
}

main().then(() => process.exit());
