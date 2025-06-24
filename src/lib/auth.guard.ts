import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "./auth"; // Ta vérification JWT

export async function withAdminGuard(
    req: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
    const token = req.cookies.get("auth_token")?.value;

    if (!token || !(await verifyAdminToken(token))) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    return handler(req);
}
