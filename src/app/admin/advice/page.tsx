import { redirect } from "next/navigation";

export default function AdviceRedirectPage() {
    redirect("/admin?section=advice"); // ✅ Redirige automatiquement
    return null;
}
