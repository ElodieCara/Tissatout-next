import LegalPageLayout from "@/components/Layout/LegalPageLayout";
import type { Metadata } from "next";

const baseUrl = "https://tissatout.fr";

export const metadata: Metadata = {
    title: "Licence | Tissatout",
    description: "Conditions d’utilisation et licence Creative Commons BY‑NC 4.0 pour les contenus Tissatout.",
    alternates: {
        canonical: `${baseUrl}/licence`,
    },
    openGraph: {
        title: "Licence Creative Commons | Tissatout",
        description: "Ce site et ses contenus sont mis à disposition sous licence CC BY‑NC 4.0.",
        url: `${baseUrl}/licence`,
        images: [
            {
                url: `${baseUrl}/assets/cc-by-nc-logo.png`,
                width: 600,
                height: 315,
                alt: "Logo Creative Commons BY-NC",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Licence CC BY‑NC 4.0 | Tissatout",
        description: "Consultez la licence Creative Commons BY‑NC 4.0 qui régit l’utilisation de nos contenus.",
        images: [`${baseUrl}/assets/cc-by-nc-logo.png`],
    },
};

export default function LicencePage() {
    return (
        <LegalPageLayout title="Licence Creative Commons">
            <section className="legal-body__section">
                <p>
                    Tous les contenus (textes, illustrations, activités, PDF) mis à disposition sur Tissatout sont
                    placés sous la licence{" "}
                    <strong>Creative Commons Attribution ‑ Pas d’Utilisation Commerciale 4.0 International (CC BY‑NC 4.0)</strong>.
                </p>
                <p>
                    Vous êtes libre de{" "}
                    <strong>Partager</strong> (copier, distribuer et communiquer le matériel) et de{" "}
                    <strong>Adapter</strong> (remixer, transformer et créer à partir du matériel) sous réserve du respect des quatre conditions suivantes :
                </p>
                <ol className="legal-body__list">
                    <li>
                        <strong>Attribution :</strong> vous devez citer « Tissatout » comme auteur original et
                        fournir un lien vers
                        <a href="https://tissatout.fr/licence" target="_blank" rel="noopener noreferrer">
                            https://tissatout.fr/licence
                        </a>.
                    </li>
                    <li>
                        <strong>Pas d’utilisation commerciale :</strong> vous ne pouvez pas utiliser mes contenus à
                        des fins commerciales.
                    </li>
                    <li>
                        <strong>Pas de restrictions supplémentaires :</strong> vous ne pouvez pas appliquer de mesures
                        légales ou techniques vous interdisant de faire ce que la licence permet.
                    </li>
                    <li>
                        <strong>Partage dans les mêmes conditions (recommandé) :</strong> si vous modifiez ou
                        transformez ce contenu, je vous encourage (mais ne vous impose pas) à le mettre à disposition
                        sous la même licence.
                    </li>
                </ol>
            </section>

            <section className="legal-body__section">
                <p>
                    Pour consulter le texte intégral de la licence , rendez‑vous sur :
                    {" "}
                    <a
                        href="https://creativecommons.org/licenses/by-nc/4.0/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        https://creativecommons.org/licenses/by-nc/4.0/
                    </a>
                </p>
            </section>

            <section className="legal-body__section">
                <h2>Contact et informations éditeur</h2>
                <p>
                    Tissatout (micro‑entreprise)
                    <br />
                    Email : contact@tissatout.fr
                    <br />
                    SIRET : 944 191 587 00019
                </p>
            </section>
        </LegalPageLayout>
    );
}
