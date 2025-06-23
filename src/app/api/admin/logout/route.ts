import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Déconnecté" });
    response.cookies.set("auth_token", "", { path: "/", expires: new Date(0) }); // Supprime le cookie
    return response;
}
