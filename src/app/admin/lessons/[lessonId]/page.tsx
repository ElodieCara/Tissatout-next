"use client";

import { useParams } from "next/navigation";
import AdminLessonForm from "@/app/admin/components/AdminLessonForm";

export default function Page() {
    const params = useParams();

    if (!params || typeof params.lessonId !== "string") {
        return <p>⛔ Erreur : Identifiant de leçon introuvable.</p>;
    }

    return <AdminLessonForm lessonId={params.lessonId} />;
}
