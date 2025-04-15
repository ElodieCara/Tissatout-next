import LegalPageLayout from "@/components/Layout/LegalPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookies | Tissatout",
    description: "Politique d'utilisation des cookies sur le site Tissatout.",
};

export default function CookiesPage() {
    return (
        <LegalPageLayout title="Utilisation des cookies">
            <p>
                Le site Tissatout utilise très peu de cookies. Ils sont strictement limités à des besoins techniques
                (préférences de navigation) ou statistiques anonymes (via un outil sans pistage).
            </p>
            <p>
                En naviguant sur le site, vous acceptez l’utilisation minimale de ces cookies nécessaires au bon
                fonctionnement.
            </p>
            <p>
                Vous pouvez configurer votre navigateur pour bloquer les cookies si vous le souhaitez, sans que cela n’empêche
                l’accès au site.
            </p>
        </LegalPageLayout>
    );
}
