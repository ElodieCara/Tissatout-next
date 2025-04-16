import LegalPageLayout from "@/components/Layout/LegalPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Utilisation des cookies | Tissatout",
    description: "Politique d'utilisation des cookies sur le site Tissatout, dans le respect de la vie privée.",
};

export default function CookiesPage() {
    return (
        <LegalPageLayout title="Utilisation des cookies">
            <p>
                Le site <strong>Tissatout</strong> n'utilise <strong>aucun cookie de pistage publicitaire</strong>, ni traceur tiers.
            </p>

            <p>
                Seuls des cookies strictement nécessaires au bon fonctionnement du site peuvent être utilisés :
            </p>
            <ul>
                <li>Préférences de navigation (langue, affichage...)</li>
                <li>Sécurité et protection contre les attaques (CSRF, etc.)</li>
                <li>Mesures d’audience anonymes (facultatif, avec outil respectueux)</li>
            </ul>

            <p>
                En naviguant sur le site, vous acceptez l’utilisation minimale de ces cookies dits “essentiels”. Aucun
                cookie n’est utilisé pour suivre ou profiler les visiteurs.
            </p>

            <p>
                Vous pouvez configurer votre navigateur pour bloquer tout ou partie des cookies. Cela ne bloquera pas l’accès
                au site, mais pourrait désactiver certaines préférences.
            </p>

            <p>
                Si nous devions à l’avenir intégrer un outil de mesure d’audience ou des services tiers, <strong>votre consentement explicite serait requis</strong>, conformément au RGPD.
            </p>
        </LegalPageLayout>
    );
}
