import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const { password } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    const token = jwt.sign({ role: "admin" }, process.env.SECRET_KEY as string, {
        expiresIn: "1h",
    });

    const response = NextResponse.json({ message: "Authentification réussie" });
    response.cookies.set("auth_token", token, {
        httpOnly: true, path: "/",
        maxAge: 3600,
    });
    return response;
}


