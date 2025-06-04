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
                <p className="legal__section-text">Tisseline <br />
                    SIRET : 94419158400019 <br />
                    Adresse : non communiquée publiquement conformément à l’article R123-237 du Code de commerce.</p>
            </div>

            <div className="legal__section">
                <h2 className="legal__section-title">Responsable de la publication</h2>
                <p className="legal__section-text">Elodie Caradeuc</p>
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
                    Vercel Inc.<br />
                    340 S Lemon Ave #4133<br />
                    Walnut, CA 91789<br />
                    États-Unis<br />
                    Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
                </p>
                <p className="legal__section-text">
                    Ce site est hébergé en Europe via le réseau CDN de Vercel et respecte les réglementations
                    applicables en matière de protection des données (RGPD).
                </p>
            </div>
        </LegalPageLayout>
    );
}