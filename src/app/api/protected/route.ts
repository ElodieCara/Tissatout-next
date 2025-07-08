import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY!));
        return NextResponse.json({ message: "OK - Token valid" }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    }
}
