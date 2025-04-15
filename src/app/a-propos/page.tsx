import LegalPageLayout from "@/components/Layout/LegalPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Qui sommes-nous ? | Tissatout",
    description: "Découvrez l'équipe, les valeurs et la mission du site Tissatout.",
};

export default function AProposPage() {
    return (
        <LegalPageLayout title="Qui sommes-nous ?">
            <p>
                Tissatout est un site éducatif indépendant créé pour accompagner les enfants dans leurs apprentissages, en
                particulier autour du Trivium et du Quadrivium. Notre approche est à la fois ludique, exigeante, et enracinée
                dans une vision humaniste du savoir.
            </p>
            <p>
                Notre mission est de proposer un contenu clair, de qualité, respectueux de l’intelligence des enfants, en
                dehors des logiques marchandes ou du nivellement par le bas.
            </p>
            <p>
                Tissatout est développé par une créatrice passionnée, développeuse web, pédagogue et maman, qui souhaite offrir
                un espace libre, beau et enrichissant.
            </p>
        </LegalPageLayout>
    );
}
