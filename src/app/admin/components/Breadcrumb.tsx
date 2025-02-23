"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
    const pathname = usePathname() || "/admin";
    const pathSegments = pathname.split("/").filter((segment) => segment);

    // 🔹 Mapping des sections pour des noms lisibles
    const sectionNames: Record<string, string> = {
        admin: "🏠 Accueil",
        articles: "📄 Articles",
        advice: "📜 Conseils",
        ideas: "💡 Idées",
    };

    return (
        <nav className="breadcrumb">
            <ul>
                <li>
                    <Link href="/admin">🏠 Accueil</Link>
                </li>

                {pathSegments.map((segment, index) => {
                    const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathSegments.length - 1;
                    const segmentName = sectionNames[segment] || decodeURIComponent(segment);

                    // 🔹 Si c'est le dernier élément, on enlève le lien (ex: Modifier un article)
                    return (
                        <li key={url}>
                            <span className="breadcrumb__separator"> &gt; </span>
                            {isLast ? (
                                <span>{segmentName}</span>
                            ) : (
                                <Link href={url}>{segmentName}</Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
