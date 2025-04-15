import LegalPageLayout from "@/components/Layout/LegalPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions légales | Tissatout",
    description: "Informations légales concernant le site Tissatout.",
};

export default function MentionsLegalesPage() {
    return (
        <LegalPageLayout title="Mentions légales">
            <p>Ce site est édité par : [Ton Nom / Raison sociale]</p>
            <p>Responsable de la publication : [Toi]</p>
            <p>Hébergeur : [Ton hébergeur, adresse, n° de téléphone]</p>
            <p>Pour toute question, contact via le formulaire.</p>
        </LegalPageLayout>
    );
}
