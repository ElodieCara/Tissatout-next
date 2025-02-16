"use client";
import styles from "./Ruban.module.scss";

export default function RubanTrivium() {
    return (
        <div className={styles.ruban}>
            <p>
                Le <strong>Trivium</strong> est un modèle d’apprentissage fondamental basé sur trois étapes :
                <span className={styles.grammaire}> Grammaire</span>,
                <span className={styles.logique}> Logique</span> et
                <span className={styles.rhetorique}> Rhétorique</span>.
                Cette méthode, utilisée depuis l’Antiquité, permet de développer la compréhension, la réflexion et l’expression.
            </p>

            <div className={styles.sections}>
                <div className={styles.section}>
                    <h3>🎯 Pourquoi ?</h3>
                    <p>Le Trivium structure la pensée, renforce l’esprit critique et améliore la communication.</p>
                </div>
                <div className={styles.section}>
                    <h3>⏳ Quand ?</h3>
                    <p>On applique le Trivium dès l’enfance, en adaptant les étapes aux capacités cognitives.</p>
                </div>
                <div className={styles.section}>
                    <h3>📍 Où ?</h3>
                    <p>Dans l’éducation, les jeux, les lectures, l’art et toutes les formes d’apprentissage.</p>
                </div>
            </div>
            <br />
            <p>🎯 Son objectif est de former un esprit autonome et critique, capable d’apprendre efficacement, raisonner logiquement et s’exprimer clairement. Cette approche favorise une éducation complète et équilibrée, adaptée à tous les âges.</p>
        </div>
    );
}
