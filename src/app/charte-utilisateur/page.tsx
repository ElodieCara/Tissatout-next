import LegalPageLayout from "@/components/Layout/LegalPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Charte utilisateur | Tissatout",
    description: "Règles d’utilisation du site Tissatout dans un cadre respectueux, familial et éducatif.",
    keywords: [
        "charte utilisateur",
        "conditions d'utilisation",
        "site éducatif",
        "Tissatout",
        "règles de comportement",
        "respect sur internet",
        "site pour enfants"
    ]
};

export default function CharteUtilisateurPage() {
    return (
        <LegalPageLayout title="Charte utilisateur">
            <p>
                L’utilisation du site <strong>Tissatout</strong> implique le respect de quelques règles simples mais
                fondamentales. Ce site est un espace dédié à l’apprentissage, à la curiosité et à la bienveillance.
            </p>

            <h3>1. Respect et comportement</h3>
            <ul>
                <li>Tout contenu haineux, diffamatoire, obscène ou inapproprié sera supprimé sans préavis.</li>
                <li>Les commentaires doivent rester bienveillants, utiles et constructifs.</li>
                <li>Toute tentative de harcèlement ou de manipulation sera bloquée immédiatement.</li>
            </ul>

            <h3>2. Données personnelles</h3>
            <ul>
                <li>Aucune donnée personnelle n’est collectée à des fins commerciales.</li>
                <li>Les informations éventuellement transmises (formulaire de contact) sont utilisées uniquement pour vous répondre.</li>
            </ul>

            <h3>3. Propriété intellectuelle</h3>
            <ul>
                <li>Les contenus du site (textes, images, jeux, coloriages) sont protégés par le droit d’auteur.</li>
                <li>Ils sont réservés à un usage strictement personnel, familial ou éducatif.</li>
                <li>Toute reproduction ou diffusion commerciale est interdite sans autorisation écrite.</li>
            </ul>

            <h3>4. Automatisation interdite</h3>
            <ul>
                <li>L’usage de robots, scripts ou IA pour extraire ou reproduire le contenu du site est interdit.</li>
            </ul>

            <h3>5. Utilisation éducative</h3>
            <ul>
                <li>Les enseignants, éducateurs ou professionnels sont encouragés à utiliser les ressources de Tissatout.</li>
                <li>Merci de citer Tissatout en cas de réutilisation dans un support éducatif.</li>
            </ul>

            <h3>6. Modération</h3>
            <ul>
                <li>Tissatout se réserve le droit de supprimer ou bloquer tout comportement contraire à cette charte.</li>
            </ul>

            <p>
                <strong>En résumé :</strong> Ce site est un lieu de confiance, de respect et de transmission. Soyez
                curieux, respectueux, et tout ira bien.
            </p>
        </LegalPageLayout>
    );
}
