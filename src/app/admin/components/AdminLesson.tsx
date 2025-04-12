"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Lesson {
    id: string;
    title: string;
    image?: string;
    subcategory: string;
    published: boolean;
}

export default function AdminLessons() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/modules")
            .then((res) => res.json())
            .then((data) => setLessons(data));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette leçon ?")) return;

        // Optimisme immédiat : on retire déjà de l'UI
        setLessons((prev) => prev.filter((lesson) => lesson.id !== id));

        // En arrière-plan, on fait le vrai DELETE
        await fetch(`/api/modules/${id}`, { method: "DELETE" });
    };


    return (
        <div className="admin__section">
            <h2>📚 Gestion des Leçons</h2>
            <button onClick={() => router.push("/admin/lessons/new")} className="admin__button">
                ➕ Ajouter une leçon
            </button>
            <div className="admin__list">
                {lessons.map((lesson) => (
                    <div key={lesson.id} className="admin__list-item">
                        {lesson.image && <img src={lesson.image} alt={lesson.title} width="80" />}
                        <span>
                            {lesson.title} — {lesson.subcategory} —{" "}
                            {lesson.published ? "✅ Publiée" : "🚫 Non publiée"}
                        </span>
                        <div className="admin__list-item-button">
                            <button
                                onClick={() => router.push(`/admin/lessons/${lesson.id}`)}
                                className="admin__list-item-button edit"
                            >
                                ✏️ Modifier
                            </button>
                            <button
                                onClick={() => handleDelete(lesson.id)}
                                className="admin__list-item-button delete"
                            >
                                🗑️ Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
