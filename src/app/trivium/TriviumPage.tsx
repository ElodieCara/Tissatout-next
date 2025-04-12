// app/trivium/page.tsx
import { Metadata } from "next";
import ThemeProvider from "@/components/Decorations/Themes/ThemeProvider";
import Banner from "@/components/Banner/Banner";
import Image from "next/image";
import Link from "next/link";
import { getTriviumLessons } from "@/lib/lessons";
import type { Lesson } from "@/types/lessons";

export const metadata: Metadata = {
    title: "Trivium - Apprendre à penser | Tissatout",
    description: "Explore la Grammaire, la Logique et la Rhétorique à travers des leçons adaptées aux enfants.",
};

interface TriviumPageProps {
    lessons: Lesson[];
}

export default function TriviumPage({ lessons }: TriviumPageProps) {

    const grammaire = lessons.filter(l => l.category === "Grammaire");
    const logique = lessons.filter(l => l.category === "Logique");
    const rhetorique = lessons.filter(l => l.category === "Rhétorique");

    return (
        <ThemeProvider>
            <main>
                <Banner
                    src="/assets/slide-trivium.jpg"
                    title="🎓 Le Trivium pour les Petits Curieux"
                    description="Découvre des activités amusantes pour apprendre à bien parler, réfléchir et t’exprimer. Grammaire, Logique, Rhétorique… comme les grands penseurs !"
                    buttons={[
                        { label: "📖 Grammaire", targetId: "grammaire" },
                        { label: "🧠 Logique", targetId: "logique" },
                        { label: "🗣️ Rhétorique", targetId: "rhetorique" },
                    ]}
                />

                <section className="theme-intro">
                    <h2>Qu’est-ce que le Trivium ?</h2>
                    <p>Le Trivium est une méthode d'apprentissage ancestrale fondée sur trois piliers : comprendre (Grammaire), raisonner (Logique), et s’exprimer (Rhétorique). C’est l’essence même de la pensée claire et structurée.</p>
                </section>

                <TriviumSection id="grammaire" title="📖 Grammaire" lessons={grammaire} />
                <TriviumSection id="logique" title="🧠 Logique" lessons={logique} />
                <TriviumSection id="rhetorique" title="🗣️ Rhétorique" lessons={rhetorique} />
            </main>
        </ThemeProvider>
    );
}

function TriviumSection({ id, title, lessons }: { id: string; title: string; lessons: Lesson[] }) {
    return (
        <section id={id} className="lesson-block">
            <h3>{title}</h3>
            {lessons.length === 0 ? (
                <p>Pas encore de leçons disponibles.</p>
            ) : (
                <div className="lesson-grid">
                    {lessons.map((lesson) => (
                        <LessonCard key={lesson.slug} lesson={lesson} />
                    ))}
                </div>
            )}
        </section>
    );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
    return (
        <Link href={`/trivium/${lesson.slug}`} className="lesson-card">
            <Image
                src={lesson.image || "/placeholder.jpg"}
                alt={lesson.title}
                width={300}
                height={200}
            />
            <h4>{lesson.title}</h4>
            {lesson.ageTag && <p className="lesson-card__age">📍 {lesson.ageTag}</p>}
            <p>{lesson.summary || "Une leçon à découvrir !"}</p>
        </Link>
    );
}
