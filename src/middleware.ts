import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ✅ Laisser passer la page de login
    if (pathname.startsWith("/admin/login")) {
        return NextResponse.next();
    }

    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY));
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};


