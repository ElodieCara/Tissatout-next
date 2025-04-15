import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = "https://www.tissatout.fr"; // adapte à ton domaine

    const pages = [
        "", // page d'accueil
        "about",
        "privacy-policy",
        "legal-mentions",
        "cookies",
        "user-charter",
        "contact",
        "blog",
        // tu peux en ajouter d'autres ici
    ];

    const urls = pages.map(
        (page) => `
  <url>
    <loc>${baseUrl}/${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls.join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
