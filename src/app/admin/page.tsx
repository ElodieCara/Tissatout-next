import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import AdminMenu from "./components/AdminMenu";
// import "./Admin.module.scss"; // (Facultatif si tu utilises SCSS)


export default async function AdminPage() {
    const cookieStore = cookies();
    // 1️⃣ Récupération du token
    const token = (await cookieStore).get("auth_token")?.value;

    // 2️⃣ Si pas de token → Redirection
    if (!token) {
        redirect("/admin/login");
    }

    // 3️⃣ Vérification du JWT
    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY!));
    } catch {
        redirect("/admin/login");
    }

    // ✅ Si tout est valide, on rend le menu Admin
    return <AdminMenu />;

}