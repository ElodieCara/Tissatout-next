import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Jeux éducatifs à imprimer – Trivium & Quadrivium | Tissatout",
    description: "Jeux éducatifs, fiches pédagogiques et activités à imprimer pour enfants – inspirées du Trivium et Quadrivium.",
};

export default function ActivitesAImprimerPage() {
    return (
        <div className="activites">
            <header className="activites__header">
                <h1 className="activites__title">
                    Jeux éducatifs et fiches pédagogiques à imprimer – Trivium & Quadrivium
                </h1>
                <p className="activites__description">
                    Toutes les fiches à télécharger ou à recevoir plastifiées chez vous.
                </p>
                <div className="activites__buttons">
                    <button className="activites__btn activites__btn--pdf">📥 Activités en PDF</button>
                    <button className="activites__btn activites__btn--plastifiees">📦 Activités plastifiées</button>
                </div>
            </header>

            <section className="activites__filters">
                <h2 className="activites__filters-title">Filtrer</h2>
                {/* filtres à venir */}
            </section>

            <section className="activites__grid">
                <article className="activites__card">
                    <img src="/images/compass.png" alt="Ma petite boussole" className="activites__image" />
                    <h3 className="activites__card-title">Ma petite boussole</h3>
                    <p className="activites__card-age">3–5 ans</p>
                    <div className="activites__cta">
                        <button className="activites__cta-btn">📄 Télécharger PDF</button>
                        <button className="activites__cta-btn">📦 Commander plastifiée</button>
                    </div>
                </article>
                {/* autres cards dynamiques à venir */}
            </section>
        </div>
    );
}
