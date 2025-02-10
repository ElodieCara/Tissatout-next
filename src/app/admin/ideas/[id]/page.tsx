"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminIdeaForm from "@/app/admin/components/AdminIdeaForm";

export default function EditIdeaPage({ params }: { params: { id?: string } }) {
    const [idea, setIdea] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!params?.id) return; // ✅ Attends que `params.id` soit défini avant de fetch

        fetch(`/api/ideas/${params.id}`)
            .then((res) => res.json())
            .then((data) => setIdea(data))
            .catch((err) => console.error("Erreur lors du chargement de l'idée :", err));
    }, [params?.id]); // ✅ Ajout de `params?.id` comme dépendance

    if (!params?.id) {
        return <p>🔴 Erreur : Aucun ID fourni.</p>;
    }

    return (
        <div className="admin__section">
            <h2>Modifier l'Idée 💡</h2>
            {idea ? <AdminIdeaForm ideaId={params.id} /> : <p>Chargement...</p>}
        </div>
    );
}
