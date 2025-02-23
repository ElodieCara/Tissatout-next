import { redirect } from "next/navigation";

export default function IdeasRedirectPage() {
    redirect("/admin?section=ideas"); // ✅ Redirige automatiquement
    return null;
}
