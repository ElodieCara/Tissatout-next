"use client";

import { useParams } from "next/navigation";
import AdminColoringForm from "@/app/admin/components/AdminColoringForm";

export default function EditColoringPage() {
    const params = useParams(); // ✅ Récupérer `params` côté client
    const coloringId = params?.id as string; // ✅ S'assurer que c'est une `string`

    if (!coloringId) {
        return <p>❌ Erreur : Aucun ID fourni.</p>;
    }

    return <AdminColoringForm coloringId={coloringId} />;
}
