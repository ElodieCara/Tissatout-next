import LegalPageLayout from "@/components/Layout/LegalPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions légales | Tissatout",
    description: "Informations légales concernant le site Tissatout.",
};

export default function MentionsLegalesPage() {
    return (
        <LegalPageLayout title="Mentions légales">
            <div className="legal__section">
                <h2 className="legal__section-title">Éditeur du site</h2>
                <p className="legal__section-text">[Ton Nom ou Raison sociale]</p>
            </div>

            <div className="legal__section">
                <h2 className="legal__section-title">Responsable de la publication</h2>
                <p className="legal__section-text">[Ton Prénom et Nom]</p>
            </div>

            <div className="legal__section">
                <h2 className="legal__section-title">Contact</h2>
                <p className="legal__section-text">
                    Pour toute question, veuillez utiliser le{" "}
                    <a href="/contact">formulaire de contact</a>.
                </p>
            </div>

            <div className="legal__section">
                <h2 className="legal__section-title">Hébergement</h2>
                <p className="legal__section-text">
                    [Nom de l’hébergeur]<br />
                    [Adresse postale]<br />
                    [Numéro de téléphone ou site web]
                </p>
                <p className="legal__section-text">
                    Ce site est hébergé en Europe et respecte les réglementations
                    applicables en matière de protection des données.
                </p>
            </div>
        </LegalPageLayout>
    );
}