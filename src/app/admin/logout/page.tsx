"use client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
    }

    return (
        <button
            onClick={handleLogout}
            style={{
                padding: "8px 16px",
                borderRadius: "4px",
                backgroundColor: "#c0392b",
                color: "#fff",
            }}
        >
            Déconnexion
        </button>
    );
}
