import LegalPageLayout from "@/components/Layout/LegalPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de confidentialité | Tissatout",
    description: "Découvrez comment Tissatout respecte votre vie privée et protège vos données.",
};

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout title="Politique de confidentialité">
            <p><strong>Dernière mise à jour :</strong> [À compléter]</p>

            <h2>1. Qui sommes-nous ?</h2>
            <p>
                Tissatout est un site éducatif indépendant, sans publicité ni pistage, conçu pour proposer aux familles des activités intelligentes, sobres et respectueuses.
                Nous croyons que l’éducation ne doit pas être soumise à la surveillance ou à l’exploitation des données personnelles.
            </p>

            <h2>2. Données collectées</h2>
            <p><strong>Nous ne collectons aucune donnée personnelle automatiquement.</strong></p>
            <ul>
                <li>❌ Pas de Google Analytics, ni autre pisteur tiers</li>
                <li>❌ Pas de cookies publicitaires</li>
                <li>❌ Pas de pixels sociaux ou commerciaux</li>
                <li>❌ Pas de géolocalisation</li>
                <li>❌ Pas de profilage</li>
            </ul>
            <p>
                Si vous nous contactez via le formulaire, nous recevrons uniquement les données que vous choisissez de nous envoyer : prénom, email, message.
                Ces informations ne sont utilisées que pour répondre à votre message et ne sont jamais revendues ni stockées dans une base de données persistante.
            </p>

            <h2>3. Hébergement & sécurité</h2>
            <p>
                Le site est hébergé par [Nom de l’hébergeur], situé en [Pays]. Toutes les données transitent via une connexion sécurisée (HTTPS).
            </p>

            <h2>4. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
                <li>🔍 Droit d'accès</li>
                <li>✏️ Droit de rectification</li>
                <li>🗑️ Droit à l'effacement</li>
            </ul>
            <p>
                Pour exercer vos droits, vous pouvez nous contacter à cette adresse : <strong>contact@tissatout.fr</strong>
            </p>

            <h2>5. Aucune utilisation commerciale</h2>
            <p>
                Nous ne vendons, ne louons et ne transmettons aucune donnée personnelle à des tiers. Nous ne réalisons aucun ciblage publicitaire, aucun profilage comportemental.
            </p>

            <h2>6. Statistiques (optionnel)</h2>
            <p>
                Si nous utilisons un jour un outil d’analyse d’audience (ex : Plausible), ce sera un outil respectueux de la vie privée, sans cookies ni collecte de données nominatives.
            </p>

            <h2>7. Modification de cette politique</h2>
            <p>
                Cette politique peut être modifiée si nous ajoutons de nouveaux outils ou services. Toute modification significative sera signalée sur le site.
            </p>

            <h2>8. Contact</h2>
            <p>
                Pour toute question relative à vos données personnelles ou à notre politique de confidentialité, vous pouvez nous contacter à : <strong>contact@tissatout.com</strong>
            </p>

            <p><strong>Chez Tissatout, nous croyons que le respect de la vie privée n’est pas une option. C’est une base.</strong></p>
        </LegalPageLayout>
    );
}
