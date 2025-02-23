import { redirect } from "next/navigation";

export default function ArticlesRedirectPage() {
    redirect("/admin?section=articles"); // ✅ Redirige automatiquement
    return null;
}
