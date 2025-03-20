"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // ✅ Ajout de useParams()
import AdminIdeaForm from "@/app/admin/components/AdminIdeaForm";

export default function EditIdeaPage() {
    const [idea, setIdea] = useState(null);
    const router = useRouter();
    const params = useParams(); // ✅ Récupère params

    // ✅ Vérifie que params n'est pas null avant de l'utiliser
    const ideaId = params && params.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;

    useEffect(() => {
        if (!ideaId) return; // ✅ Évite les fetch inutiles si l'ID est absent

        fetch(`/api/ideas/${ideaId}`)
            .then((res) => res.json())
            .then((data) => setIdea(data))
            .catch((err) => console.error("❌ Erreur lors du chargement de l'idée :", err));
    }, [ideaId]); // ✅ Ajout de `ideaId` comme dépendance

    if (!ideaId) {
        return <p>🔴 Erreur : Aucun ID fourni.</p>;
    }

    return (
        <div className="admin__section">
            <h2>Modifier l'Idée 💡</h2>
            {idea ? <AdminIdeaForm ideaId={ideaId} /> : <p>Chargement...</p>}
        </div>
    );
}
