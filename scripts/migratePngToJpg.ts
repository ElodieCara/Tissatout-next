// scripts/migratePngToJpg.ts
import prisma from "@/lib/prisma";

function swapExt(url?: string | null) {
    if (!url) return url;
    const u = url.trim();
    if (!u) return url;
    if (/\.(pdf)$/i.test(u)) return url;           // 🔒 ne touche jamais aux PDF
    return u.replace(/\.png$/i, ".jpg");           // remplace uniquement .png en .jpg (fin de chaîne)
}

function swapArray(arr?: string[] | null): string[] | null | undefined {
    if (!arr) return arr;
    let changed = false;
    const out = arr.map((s) => {
        const r = swapExt(s);
        if (r !== s) changed = true;
        return r!;
    });
    return changed ? out : arr;
}

async function run() {
    let changes = 0;

    // ---------- Article ----------
    {
        const rows = await prisma.article.findMany();
        for (const r of rows) {
            const data: any = {};
            const image = swapExt(r.image);
            const iconSrc = swapExt(r.iconSrc);
            if (image !== r.image) data.image = image;
            if (iconSrc !== r.iconSrc) data.iconSrc = iconSrc;
            if (Object.keys(data).length) {
                await prisma.article.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- Idea ----------
    {
        const rows = await prisma.idea.findMany();
        for (const r of rows) {
            const data: any = {};
            const image = swapExt(r.image);
            if (image !== r.image) data.image = image;
            if (Object.keys(data).length) {
                await prisma.idea.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- IdeaSection (imageUrl) ----------
    {
        const rows = await prisma.ideaSection.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = swapExt(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                await prisma.ideaSection.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- Advice ----------
    {
        const rows = await prisma.advice.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = swapExt(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                await prisma.advice.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- AdviceSection ----------
    {
        const rows = await prisma.adviceSection.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = swapExt(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                await prisma.adviceSection.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- Drawing ----------
    {
        const rows = await prisma.drawing.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = swapExt(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                await prisma.drawing.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- PrintableGame ----------
    {
        const rows = await prisma.printableGame.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = swapExt(r.imageUrl);
            const previewImageUrl = swapExt(r.previewImageUrl);
            // pdfUrl volontairement ignoré (peut être .pdf)
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (previewImageUrl !== r.previewImageUrl) data.previewImageUrl = previewImageUrl;
            if (Object.keys(data).length) {
                await prisma.printableGame.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- ExtraImage (pour PrintableGame) ----------
    {
        const rows = await prisma.extraImage.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = swapExt(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                await prisma.extraImage.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- AgeCategory ----------
    {
        const rows = await prisma.ageCategory.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageCard = swapExt(r.imageCard);
            const imageBanner = swapExt(r.imageBanner);
            if (imageCard !== r.imageCard) data.imageCard = imageCard;
            if (imageBanner !== r.imageBanner) data.imageBanner = imageBanner;
            if (Object.keys(data).length) {
                await prisma.ageCategory.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- CategorySection ----------
    {
        const rows = await prisma.categorySection.findMany();
        for (const r of rows) {
            const data: any = {};
            const iconSrc = swapExt(r.iconSrc);
            if (iconSrc !== r.iconSrc) data.iconSrc = iconSrc;
            if (Object.keys(data).length) {
                await prisma.categorySection.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- DrawingCategory ----------
    {
        const rows = await prisma.drawingCategory.findMany();
        for (const r of rows) {
            const data: any = {};
            const iconSrc = swapExt(r.iconSrc);
            if (iconSrc !== r.iconSrc) data.iconSrc = iconSrc;
            if (Object.keys(data).length) {
                await prisma.drawingCategory.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- HomeSlide ----------
    {
        const rows = await prisma.homeSlide.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = swapExt(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                await prisma.homeSlide.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- Lesson ----------
    {
        const rows = await prisma.lesson.findMany();
        for (const r of rows) {
            const data: any = {};
            const image = swapExt(r.image);
            if (image !== r.image) data.image = image;
            if (Object.keys(data).length) {
                await prisma.lesson.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    // ---------- SiteSettings (beaucoup de champs image + un tableau) ----------
    {
        const rows = await prisma.siteSettings.findMany();
        for (const r of rows) {
            const data: any = {};
            const homeBanners = swapArray(r.homeBanners);
            const universBanner = swapExt(r.universBanner);
            const coloringBanner = swapExt(r.coloringBanner);
            const adviceBanner = swapExt(r.adviceBanner);
            const ideasBanner = swapExt(r.ideasBanner);
            const agePageBanner = swapExt(r.agePageBanner);
            const newsBanner = swapExt(r.newsBanner);

            if (homeBanners !== r.homeBanners) data.homeBanners = homeBanners;
            if (universBanner !== r.universBanner) data.universBanner = universBanner;
            if (coloringBanner !== r.coloringBanner) data.coloringBanner = coloringBanner;
            if (adviceBanner !== r.adviceBanner) data.adviceBanner = adviceBanner;
            if (ideasBanner !== r.ideasBanner) data.ideasBanner = ideasBanner;
            if (agePageBanner !== r.agePageBanner) data.agePageBanner = agePageBanner;
            if (newsBanner !== r.newsBanner) data.newsBanner = newsBanner;

            if (Object.keys(data).length) {
                await prisma.siteSettings.update({ where: { id: r.id }, data });
                changes++;
            }
        }
    }

    console.log(`✅ Migration terminée. Enregistrements modifiés : ${changes}`);
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
