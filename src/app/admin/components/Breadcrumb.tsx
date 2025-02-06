"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
    const pathname = usePathname() || "/admin"; // ✅ Sécurité : Valeur par défaut si `null`
    const pathSegments = pathname.split("/").filter((segment) => segment);

    return (
        <nav className="breadcrumb">
            <ul>
                <li>
                    <Link href="/admin">🏠 Accueil</Link>
                </li>
                {pathSegments.map((segment, index) => {
                    const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
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
