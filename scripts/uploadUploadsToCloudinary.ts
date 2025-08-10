// scripts/uploadUploadsToCloudinary.ts
import path from "path";
import fs from "fs/promises";
import prisma from "../src/lib/prisma";
import cloudinary from "../src/lib/cloudinary";

const DRY_RUN = process.env.DRY_RUN === "1";

// Détecte les URLs locales vers /uploads
function isLocalUploadsUrl(url?: string | null): url is string {
    return !!url && /^\/?uploads\//i.test(url) || !!url && /^\/uploads\//i.test(url);
}

// Nettoie et normalise l’URL locale (enlève le /initial si présent)
function normalizeLocalUrl(url: string) {
    return url.replace(/^\/+/, ""); // supprime les "/" de début
}

// Construit le chemin absolu dans /public
function toAbsolutePath(localUrl: string) {
    const rel = normalizeLocalUrl(localUrl); // ex: uploads/foo/bar.jpg
    return path.join(process.cwd(), "public", rel);
}

// Uploade un fichier local vers Cloudinary et renvoie secure_url
async function uploadOne(localUrl: string): Promise<string | null> {
    try {
        const abs = toAbsolutePath(localUrl);
        // Vérifie que le fichier existe
        await fs.access(abs);

        // On reconstruit un dossier Cloudinary cohérent (préserve la hiérarchie après "uploads/")
        const rel = normalizeLocalUrl(localUrl);          // uploads/…/file.jpg
        const parts = rel.split("/");                     // ["uploads", "...", "file.jpg"]
        const fileName = parts.pop() as string;           // "file.jpg"
        const folder = ["tissatout", ...parts].join("/"); // "tissatout/uploads/..."

        // Uploade
        const res = await cloudinary.uploader.upload(abs, {
            folder,
            use_filename: true,
            unique_filename: false, // garde le nom si possible
            overwrite: false,
            resource_type: "image",
        });

        return res.secure_url ?? null;
    } catch (err) {
        console.error("❌ Upload échoué pour", localUrl, err);
        return null;
    }
}

// Remplace une URL si locale -> upload -> retourne nouvelle URL
async function maybeUploadUrl(url?: string | null): Promise<string | null | undefined> {
    if (!url) return url;
    // Si déjà Cloudinary ou http(s), on ne touche pas
    if (/^https?:\/\//i.test(url) && /res\.cloudinary\.com/i.test(url)) return url;
    if (/^https?:\/\//i.test(url) && !isLocalUploadsUrl(url)) return url;

    if (!isLocalUploadsUrl(url)) return url;

    if (DRY_RUN) {
        console.log("[DRY] upload:", url);
        return url; // on simule
    }

    const uploaded = await uploadOne(url.startsWith("/") ? url.slice(1) : url);
    return uploaded ?? url;
}

// Traite un tableau d’URLs (ex: homeBanners)
async function maybeUploadArray(arr?: string[] | null) {
    if (!arr || !Array.isArray(arr)) return arr;
    const out: string[] = [];
    let changed = false;

    for (const u of arr) {
        const nu = await maybeUploadUrl(u);
        out.push(nu ?? u);
        if (nu !== u) changed = true;
    }

    return changed ? out : arr;
}

async function run() {
    let totalUpdates = 0;

    // ---------- Article ----------
    {
        const rows = await prisma.article.findMany();
        for (const r of rows) {
            const data: any = {};
            const image = await maybeUploadUrl(r.image);
            const iconSrc = await maybeUploadUrl(r.iconSrc);
            if (image !== r.image) data.image = image;
            if (iconSrc !== r.iconSrc) data.iconSrc = iconSrc;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] article", r.id, data);
                else await prisma.article.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ Article OK");
    }

    // ---------- Idea ----------
    {
        const rows = await prisma.idea.findMany();
        for (const r of rows) {
            const data: any = {};
            const image = await maybeUploadUrl(r.image);
            if (image !== r.image) data.image = image;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] idea", r.id, data);
                else await prisma.idea.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ Idea OK");
    }

    // ---------- IdeaSection ----------
    {
        const rows = await prisma.ideaSection.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = await maybeUploadUrl(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] ideaSection", r.id, data);
                else await prisma.ideaSection.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ IdeaSection OK");
    }

    // ---------- Advice ----------
    {
        const rows = await prisma.advice.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = await maybeUploadUrl(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] advice", r.id, data);
                else await prisma.advice.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ Advice OK");
    }

    // ---------- AdviceSection ----------
    {
        const rows = await prisma.adviceSection.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = await maybeUploadUrl(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] adviceSection", r.id, data);
                else await prisma.adviceSection.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ AdviceSection OK");
    }

    // ---------- Drawing ----------
    {
        const rows = await prisma.drawing.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = await maybeUploadUrl(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] drawing", r.id, data);
                else await prisma.drawing.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ Drawing OK");
    }

    // ---------- PrintableGame ----------
    {
        const rows = await prisma.printableGame.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = await maybeUploadUrl(r.imageUrl);
            const previewImageUrl = await maybeUploadUrl(r.previewImageUrl);
            // pdfUrl ignoré (PDF)
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (previewImageUrl !== r.previewImageUrl) data.previewImageUrl = previewImageUrl;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] printableGame", r.id, data);
                else await prisma.printableGame.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ PrintableGame OK");
    }

    // ---------- ExtraImage ----------
    {
        const rows = await prisma.extraImage.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = await maybeUploadUrl(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] extraImage", r.id, data);
                else await prisma.extraImage.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ ExtraImage OK");
    }

    // ---------- AgeCategory ----------
    {
        const rows = await prisma.ageCategory.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageCard = await maybeUploadUrl(r.imageCard);
            const imageBanner = await maybeUploadUrl(r.imageBanner);
            if (imageCard !== r.imageCard) data.imageCard = imageCard;
            if (imageBanner !== r.imageBanner) data.imageBanner = imageBanner;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] ageCategory", r.id, data);
                else await prisma.ageCategory.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ AgeCategory OK");
    }

    // ---------- CategorySection ----------
    {
        const rows = await prisma.categorySection.findMany();
        for (const r of rows) {
            const data: any = {};
            const iconSrc = await maybeUploadUrl(r.iconSrc);
            if (iconSrc !== r.iconSrc) data.iconSrc = iconSrc;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] categorySection", r.id, data);
                else await prisma.categorySection.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ CategorySection OK");
    }

    // ---------- DrawingCategory ----------
    {
        const rows = await prisma.drawingCategory.findMany();
        for (const r of rows) {
            const data: any = {};
            const iconSrc = await maybeUploadUrl(r.iconSrc);
            if (iconSrc !== r.iconSrc) data.iconSrc = iconSrc;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] drawingCategory", r.id, data);
                else await prisma.drawingCategory.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ DrawingCategory OK");
    }

    // ---------- HomeSlide ----------
    {
        const rows = await prisma.homeSlide.findMany();
        for (const r of rows) {
            const data: any = {};
            const imageUrl = await maybeUploadUrl(r.imageUrl);
            if (imageUrl !== r.imageUrl) data.imageUrl = imageUrl;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] homeSlide", r.id, data);
                else await prisma.homeSlide.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ HomeSlide OK");
    }

    // ---------- Lesson ----------
    {
        const rows = await prisma.lesson.findMany();
        for (const r of rows) {
            const data: any = {};
            const image = await maybeUploadUrl(r.image);
            if (image !== r.image) data.image = image;
            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] lesson", r.id, data);
                else await prisma.lesson.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ Lesson OK");
    }

    // ---------- SiteSettings (tableau + champs) ----------
    {
        const rows = await prisma.siteSettings.findMany();
        for (const r of rows) {
            const data: any = {};
            const homeBanners = await maybeUploadArray(r.homeBanners);
            const universBanner = await maybeUploadUrl(r.universBanner);
            const coloringBanner = await maybeUploadUrl(r.coloringBanner);
            const adviceBanner = await maybeUploadUrl(r.adviceBanner);
            const ideasBanner = await maybeUploadUrl(r.ideasBanner);
            const agePageBanner = await maybeUploadUrl(r.agePageBanner);
            const newsBanner = await maybeUploadUrl(r.newsBanner);

            if (homeBanners !== r.homeBanners) data.homeBanners = homeBanners;
            if (universBanner !== r.universBanner) data.universBanner = universBanner;
            if (coloringBanner !== r.coloringBanner) data.coloringBanner = coloringBanner;
            if (adviceBanner !== r.adviceBanner) data.adviceBanner = adviceBanner;
            if (ideasBanner !== r.ideasBanner) data.ideasBanner = ideasBanner;
            if (agePageBanner !== r.agePageBanner) data.agePageBanner = agePageBanner;
            if (newsBanner !== r.newsBanner) data.newsBanner = newsBanner;

            if (Object.keys(data).length) {
                if (DRY_RUN) console.log("[DRY] siteSettings", r.id, data);
                else await prisma.siteSettings.update({ where: { id: r.id }, data });
                totalUpdates++;
            }
        }
        console.log("→ SiteSettings OK");
    }

    console.log(`\n✅ Terminé. ${DRY_RUN ? "En simulation, " : ""}${totalUpdates} enregistrements ${DRY_RUN ? "à modifier" : "modifiés"}.`);
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
