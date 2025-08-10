// scripts/findBrokenUploads.ts
import path from "path";
import fs from "fs/promises";
import prisma from "../src/lib/prisma";

const FIX = process.env.FIX === "1";
// Mets l'URL Cloudinary de secours ou "" pour mettre null :
const PLACEHOLDER = "https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/placeholder.jpg";

function looksLikeLocalUpload(u?: string | null) {
    if (!u) return false;
    return u.startsWith("/uploads/") || u.startsWith("uploads/");
}
function toAbs(u: string) {
    const rel = u.replace(/^\/+/, ""); // supprime les "/" de début
    return path.join(process.cwd(), "public", rel);
}
async function missing(u?: string | null) {
    if (!looksLikeLocalUpload(u)) return false;
    const abs = toAbs(u!);
    try {
        await fs.access(abs);
        return false; // existe
    } catch {
        return true; // manquant
    }
}

type Row = { id: string;[k: string]: any };

async function scanUpdate<T extends Row>(
    label: string,
    rows: T[],
    fields: Array<keyof T>
) {
    let broken = 0, fixed = 0;
    for (const r of rows) {
        const data: any = {};
        for (const f of fields) {
            const val = r[f] as unknown as string | null | undefined;
            if (await missing(val)) {
                broken++;
                if (FIX) {
                    data[f as string] = PLACEHOLDER ? PLACEHOLDER : null;
                } else {
                    console.log(`[MISSING] ${label} ${r.id} :: ${String(f)} = ${val}`);
                }
            }
        }
        if (Object.keys(data).length) {
            // @ts-ignore: accès dynamique
            await prisma[label as keyof typeof prisma].update({ where: { id: r.id }, data });
            fixed++;
        }
    }
    console.log(`→ ${label}: ${broken} cassées${FIX ? `, ${fixed} corrigées` : ""}.`);
}

async function run() {
    await scanUpdate("article", await prisma.article.findMany(), ["image", "iconSrc"]);
    await scanUpdate("idea", await prisma.idea.findMany(), ["image"]);
    await scanUpdate("ideaSection", await prisma.ideaSection.findMany(), ["imageUrl"]);
    await scanUpdate("advice", await prisma.advice.findMany(), ["imageUrl"]);
    await scanUpdate("adviceSection", await prisma.adviceSection.findMany(), ["imageUrl"]);
    await scanUpdate("drawing", await prisma.drawing.findMany(), ["imageUrl"]);
    await scanUpdate("printableGame", await prisma.printableGame.findMany(), ["imageUrl", "previewImageUrl"]);
    await scanUpdate("extraImage", await prisma.extraImage.findMany(), ["imageUrl"]);
    await scanUpdate("ageCategory", await prisma.ageCategory.findMany(), ["imageCard", "imageBanner"]);
    await scanUpdate("categorySection", await prisma.categorySection.findMany(), ["iconSrc"]);
    await scanUpdate("drawingCategory", await prisma.drawingCategory.findMany(), ["iconSrc"]);
    await scanUpdate("homeSlide", await prisma.homeSlide.findMany(), ["imageUrl"]);
    await scanUpdate("lesson", await prisma.lesson.findMany(), ["image"]);
    await scanUpdate("siteSettings", await prisma.siteSettings.findMany(), ["universBanner", "coloringBanner", "adviceBanner", "ideasBanner", "agePageBanner", "newsBanner"]);
    console.log("✅ Terminé.");
}

run().catch(e => { console.error(e); process.exit(1); });
