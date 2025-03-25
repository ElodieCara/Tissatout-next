// app/admin/settings/home/page.tsx
"use client";

import HomeSlidesEditor from "@/app/admin/components/HomeSlidesEditor";

export default function AdminHomeSettingsPage() {
    return (
        <div className="admin">
            <h2>🏠 Paramètres de la page d’accueil</h2>
            <HomeSlidesEditor />
        </div>
    );
}
