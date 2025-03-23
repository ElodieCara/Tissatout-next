// app/page.tsx
import prisma from "@/lib/prisma";
import NosUnivers from "./NosUnivers";

export default async function Page() {
    const settings = await prisma.siteSettings.findFirst();

    return (
        <NosUnivers
            settings={{
                universBanner: settings?.universBanner || "/default-univers.jpg",
                universTitle: settings?.universTitle || "🌟 Nos Univers",
                universDesc: settings?.universDesc || "Découvrez des activités éducatives pour tous les âges !"
            }}
        />
    );
}
