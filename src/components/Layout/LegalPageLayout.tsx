"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const pages = [
    { slug: "/a-propos", label: "Qui sommes-nous ?" },
    { slug: "/mentions-legales", label: "Mentions légales" },
    { slug: "/confidentialite", label: "Politique de confidentialité" },
    { slug: "/cookies", label: "Utilisation des cookies" },
    { slug: "/charte-utilisateur", label: "Charte utilisateur" },
];

export default function LegalPageLayout({ title, children }: { title: string; children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="legal-layout">
            <nav className="legal-nav">
                <ul>
                    {pages.map((page) => (
                        <li key={page.slug} className={pathname === page.slug ? "active" : ""}>
                            <Link href={page.slug}>{page.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className="legal-content">
                <h1>{title}</h1>
                <div className="legal-body">{children}</div>
            </main>

            <style jsx>{`
        .legal-layout {
          max-width: 900px;
          margin: 2rem auto;
          padding: 1rem;
        }

        .legal-nav ul {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 0;
          list-style: none;
        }

        .legal-nav li {
          font-weight: 500;
        }

        .legal-nav li.active a {
          text-decoration: underline;
        }

        .legal-content h1 {
          margin-bottom: 1.5rem;
        }

        .legal-body {
          line-height: 1.6;
        }
      `}</style>
        </div>
    );
}
