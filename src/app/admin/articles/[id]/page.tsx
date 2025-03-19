"use client";
import { useParams } from "next/navigation";
import AdminArticleForm from "@/app/admin/components/AdminArticleForm";

export default function ArticleEditPage() {
    const params = useParams(); // ✅ Récupérer `params` côté client
    const articleId = params?.id as string; // ✅ S'assurer que c'est une `string`

    if (!articleId) {
        return <p>❌ Erreur : Aucun ID fourni.</p>;
    }

    return <AdminArticleForm articleId={articleId} />;
}
