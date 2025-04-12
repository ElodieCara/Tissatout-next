import { redirect } from "next/navigation";

export default function LessonsRedirectPage() {
    redirect("/admin?section=modules");
    return null;
}
