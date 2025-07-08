import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1️⃣ Laisser passer la page de login et l'API de login
    if (
        pathname === "/admin/login" ||
        pathname === "/api/admin/login"
    ) {
        return NextResponse.next();
    }

    const isApiAdmin = pathname.startsWith("/api/admin");
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        if (isApiAdmin) {
            return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY!));
        return NextResponse.next();
    } catch {
        if (isApiAdmin) {
            return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
