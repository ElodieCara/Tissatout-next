import { redirect } from "next/navigation";

export default function ColoringRedirectPage() {
    redirect("/admin?section=coloring"); // ✅ Redirige automatiquement vers la section coloriages
    return null;
}
