"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const pages = [
    { slug: "/a-propos", label: "Qui suis-je ?" },
    { slug: "/mentions-legales", label: "Mentions légales" },
    { slug: "/confidentialite", label: "Politique de confidentialité" },
    { slug: "/cookies", label: "Utilisation des cookies" },
    { slug: "/charte-utilisateur", label: "Charte utilisateur" },
    { slug: "/licence", label: "Licence CC BY‑NC 4.0" },
];

export default function LegalPageLayout({ title, children }: { title: string; children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="legal-layout">
            <nav className="legal-layout__nav">
                <ul>
                    {pages.map((page) => (
                        <li key={page.slug} className={pathname === page.slug ? "active" : ""}>
                            <Link href={page.slug}>{page.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className="legal-layout__content">
                <h1>{title}</h1>
                <div className="legal-layout__body">{children}</div>
            </main>
        </div>
    );
}
