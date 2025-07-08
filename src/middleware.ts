// middleware.ts à la racine

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const isApiAdmin = pathname.startsWith("/api/admin");
    const isAdminPage = pathname.startsWith("/admin");

    // Toujours laisser passer la page de login
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    // Récupérer le token cookie
    const token = req.cookies.get("auth_token")?.value;

    // Si pas de token
    if (!token) {
        if (isApiAdmin) {
            // Pour l'API, renvoyer un 401 JSON
            return NextResponse.json(
                { error: "Unauthorized - No token" },
                { status: 401 }
            );
        }
        // Pour une page admin, rediriger vers login
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Si token présent, vérifier sa validité
    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY!));
        return NextResponse.next();
    } catch {
        if (isApiAdmin) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            );
        }
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
