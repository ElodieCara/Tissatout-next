import LegalPageLayout from "@/components/Layout/LegalPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de confidentialité | Tissatout",
    description: "Détail des données personnelles collectées sur le site Tissatout.",
};

export default function ConfidentialitePage() {
    return (
        <LegalPageLayout title="Politique de confidentialité">
            <p>
                Tissatout respecte votre vie privée. Les données collectées via les formulaires de contact ou les commentaires
                sont strictement utilisées pour répondre à vos messages et améliorer le site.
            </p>
            <p>
                Aucune donnée personnelle n’est vendue ni transmise à des tiers. Vous pouvez demander la suppression de vos
                données en nous contactant.
            </p>
            <p>
                Le site utilise des outils de mesure d’audience anonymisée (comme Plausible ou Matomo, sans cookies) pour
                améliorer l’expérience utilisateur.
            </p>
        </LegalPageLayout>
    );
}
