"use client";
import styles from "./Banderole.module.scss";

export default function BanderoleTrivium() {
    return (
        <section className={styles.banner}>
            <h2>Comprendre le Trivium : Apprendre avec Méthode</h2>
            <p>
                Le Trivium est une approche éducative classique qui se divise en trois étapes : <strong>Grammaire</strong> (assimiler les bases),
                <strong> Logique</strong> (développer la réflexion) et <strong>Rhétorique</strong> (exprimer ses idées).
            </p>
            <div className={styles.categories}>
                <div className={styles.category}>
                    <span className={styles.grammaire}>📖</span>
                    <h3>Grammaire</h3>
                    <p>Comprendre et apprendre les fondamentaux.</p>
                </div>
                <div className={styles.category}>
                    <span className={styles.logique}>🧠</span>
                    <h3>Logique</h3>
                    <p>Analyser et structurer la pensée.</p>
                </div>
                <div className={styles.category}>
                    <span className={styles.rhetorique}>🎤</span>
                    <h3>Rhétorique</h3>
                    <p>Exprimer ses idées et débattre.</p>
                </div>
            </div>
        </section>
    );
}
