"use client";

export default function TriviumInfo() {
    return (
        <section className="trivium-info">
            <h3 className="trivium-info__title">
                Le Trivium, une boussole pour apprendre à penser
            </h3>
            <p className="trivium-info__subtitle">
                Hérité de l’Antiquité, le Trivium repose sur trois piliers — Grammaire, Logique et Rhétorique — pour aider les enfants à comprendre, réfléchir et s’exprimer avec clarté.
            </p>

            <div className="trivium-info__cards">
                <div className="trivium-info__card">
                    <h3 className="trivium-info__card-title">Pourquoi ?</h3>
                    <img src="/icons/ampoule.png" alt="Ampoule mignonne" className="trivium-info__icon" />
                    <p className="trivium-info__card-text">
                        Parce qu’un esprit bien formé sait organiser ses idées, poser les bonnes questions et communiquer avec justesse.
                    </p>
                </div>

                <div className="trivium-info__card">
                    <h3 className="trivium-info__card-title">Quand ?</h3>
                    <img src="/icons/sablier.png" alt="Sablier joyeux" className="trivium-info__icon" />
                    <p className="trivium-info__card-text">
                        Dès l’enfance : on adapte chaque étape aux capacités et à la maturité de l’enfant.
                    </p>
                </div>

                <div className="trivium-info__card">
                    <h3 className="trivium-info__card-title">Où ?</h3>
                    <img src="/icons/boussole.png" alt="Boussole douce" className="trivium-info__icon" />
                    <p className="trivium-info__card-text">
                        Dans les jeux, les lectures, les activités manuelles ou les discussions du quotidien.
                    </p>
                </div>
            </div>

            <p className="trivium-info__conclusion">
                <strong>Son but :</strong> former des esprits libres et critiques, capables d’apprendre, de comprendre et de choisir avec intelligence.
            </p>
        </section>
    );
}
