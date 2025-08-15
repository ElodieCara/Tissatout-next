// src/app/coloriages/explorer/components/ExplorerBanner.tsx
"use client";
import Link from "next/link";

type Props = {
    title: string;
    description?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    onClick?: () => void; // ← tu gardes
};

export default function ExplorerBanner({
    title,
    subtitle,
    ctaLabel = "Explorer",
    ctaHref,
    onClick, // ← destructuré ET utilisé plus bas
}: Props) {
    return (
        <header className="explorer-banner">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}

            {ctaHref ? (
                <Link href={ctaHref} className="button yellow-button" onClick={onClick}>
                    {ctaLabel}
                </Link>
            ) : (
                <button type="button" className="button yellow-button" onClick={onClick}>
                    {ctaLabel}
                </button>
            )}
        </header>
    );
}
