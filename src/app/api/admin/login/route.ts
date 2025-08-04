import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Antibot léger : mémoire temporaire
const rateLimitMap = new Map<string, { count: number; lastTry: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 1000 * 60 * 15; // 15 minutes

function getClientIP(req: NextRequest): string {
    const xff = req.headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim(); // Premier IP
    return "unknown";
}

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const ip = getClientIP(req);
    const now = Date.now();
    const rate = rateLimitMap.get(ip);

    if (rate && rate.count >= MAX_ATTEMPTS && now - rate.lastTry < BLOCK_TIME) {
        return NextResponse.json({ error: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
        rateLimitMap.set(ip, {
            count: rate ? rate.count + 1 : 1,
            lastTry: now,
        });

        return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }

    rateLimitMap.delete(ip); // Réinitialise

    const token = jwt.sign(
        { role: "admin", email: admin.email },
        process.env.SECRET_KEY as string,
        { expiresIn: "1h" }
    );

    const response = NextResponse.json({ message: "Authentification réussie" });
    response.cookies.set("auth_token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 3600,
    });

    return response;
}
