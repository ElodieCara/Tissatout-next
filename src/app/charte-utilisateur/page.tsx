import LegalPageLayout from "@/components/Layout/LegalPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Charte utilisateur | Tissatout",
    description: "Règles de conduite et d'utilisation du site Tissatout.",
};

export default function CharteUtilisateurPage() {
    return (
        <LegalPageLayout title="Charte utilisateur">
            <p>
                L’utilisation du site Tissatout implique le respect des autres utilisateurs, des enfants, et de l’équipe
                éditoriale.
            </p>
            <ul>
                <li>Tout contenu offensant, haineux ou déplacé sera supprimé sans préavis.</li>
                <li>Les commentaires doivent rester bienveillants, constructifs et pertinents.</li>
                <li>Tout spam ou tentative de manipulation sera immédiatement bloqué.</li>
            </ul>
            <p>
                Le respect, la courtoisie et la recherche sincère du savoir sont les seules règles qui comptent vraiment ici.
            </p>
        </LegalPageLayout>
    );
}
