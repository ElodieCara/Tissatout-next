import Link from "next/link";

interface Crumb {
    label: string;
    href?: string;
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
    return (
        <nav aria-label="Fil d’Ariane" className="breadcrumb-page">
            <ol className="breadcrumb__list">
                {crumbs.map((crumb, index) => (
                    <li key={index} className="breadcrumb__item">
                        {crumb.href ? (
                            <>
                                <Link href={crumb.href} className="breadcrumb__link">
                                    {crumb.label}
                                </Link>
                                <span className="breadcrumb__separator">›</span>
                            </>
                        ) : (
                            <span className="breadcrumb__current">{crumb.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
