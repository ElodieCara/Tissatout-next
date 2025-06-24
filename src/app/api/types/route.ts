import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminGuard } from "@/lib/auth.guard";

export async function GET() {
    try {
        const types = await prisma.activityType.findMany({
            select: { id: true, label: true },
        });
        return NextResponse.json(types);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        const body = await req.json();
        if (!body.label) {
            return NextResponse.json({ error: "Le champ 'label' est requis" }, { status: 400 });
        }

        const type = await prisma.activityType.create({
            data: { label: body.label },
        });
        return NextResponse.json(type);
    });
}
