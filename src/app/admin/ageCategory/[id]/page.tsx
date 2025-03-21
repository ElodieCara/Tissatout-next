"use client";

import { useParams } from "next/navigation";
import AdminAgeCategoryForm from "../../components/AdminAgeCategoryForm";

export default function Page() {
    const params = useParams();

    if (!params || typeof params.id !== "string") {
        return <p>Paramètre invalide</p>; // sécurité minimale
    }

    return <AdminAgeCategoryForm ageCategoryId={params.id} />;
}
