"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ConfirmPage() {
    const searchParams = useSearchParams();
    const token = searchParams?.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        fetch(`/api/confirm?token=${token}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Confirmation échouée");
                }
                return res.json();
            })
            .then(() => {
                setStatus("success");
            })
            .catch(() => {
                setStatus("error");
            });
    }, [token]);

    if (status === "loading") {
        return <div>Vérification en cours…</div>;
    }

    if (status === "success") {
        return <div>✅ Email confirmé avec succès !</div>;
    }

    return <div>❌ Le lien de confirmation est invalide ou a expiré</div>;
}
