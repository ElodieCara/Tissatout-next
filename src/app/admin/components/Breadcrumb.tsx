"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
    const pathname = usePathname() || "/admin";
    const pathSegments = pathname.split("/").filter((segment) => segment);

    return (
        <nav className="breadcrumb">
            <ul>
                <li>
                    <Link href="/admin">🏠 Accueil</Link>
                </li>
                {pathSegments.map((segment, index) => {
                    const url = `/${pathSegments.slice(0, index + 1).join("/")}`;

                    // 🟢 Cas spécial pour "/admin/articles"
                    if (url === "/admin/articles") {
                        return (
                            <li key={url}>
                                <span className="breadcrumb__separator"> &gt; </span>
                                <Link href={url}>Articles</Link>
                            </li>
                        );
                    }

                    // 🟡 Vérifier si c'est une page de création
                    if (url === "/admin/articles/new") {
                        return (
                            <li key={url}>
                                <span className="breadcrumb__separator"> &gt; </span>
                                <Link href={url}>Ajouter un article</Link>
                            </li>
                        );
                    }

                    // 🔴 Vérifier si c'est une page de modification (ID dynamique)
                    if (pathSegments.length === 3 && pathSegments[1] === "articles") {
                        return (
                            <li key={url}>
                                <span className="breadcrumb__separator"> &gt; </span>
                                <Link href={url}>Modifier un article</Link>
                            </li>
                        );
                    }

                    // 🔹 Par défaut, afficher le segment normal
                    return (
                        <li key={url}>
                            <span className="breadcrumb__separator"> &gt; </span>
                            <Link href={url}>{decodeURIComponent(segment)}</Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
