import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminGuard } from "@/lib/auth.guard";

export async function GET() {
    const themes = await prisma.theme.findMany({
        select: { id: true, label: true },
    });
    return NextResponse.json(themes);
}


// POST dans /api/themes/route.ts
export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        const body = await req.json();
        const theme = await prisma.theme.create({
            data: { label: body.label },
        });
        return NextResponse.json(theme);
    });
}


