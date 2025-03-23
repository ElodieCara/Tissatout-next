
import { redirect } from "next/navigation";

export default function SettingsRedirectPage() {
    redirect("/admin?section=settings"); // ✅ Redirige automatiquement
    return null;
}
