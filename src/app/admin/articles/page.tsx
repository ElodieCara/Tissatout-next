"use client";
import Breadcrumb from "../components/Breadcrumb";
import AdminArticles from "../components/AdminArticles"; // ✅ On importe directement le composant

export default function ArticlesPage() {
    return (
        <div className="admin">
            <Breadcrumb /> {/* ✅ Fil d'ariane propre */}
            <h1 className="admin__title">📄 Gestion des Articles</h1>

            {/* 🔥 On affiche directement `AdminArticles.tsx` au lieu de recréer la logique */}
            <AdminArticles />
        </div>
    );
}
