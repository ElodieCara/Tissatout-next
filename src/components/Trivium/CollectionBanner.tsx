"use client";

import { useState, useEffect } from "react";

interface CollectionBannerProps {
    title: string;
    description?: string;
    count: number;
    onClear: () => void;
}

export default function CollectionBanner({
    title,
    description,
    count,
    onClear,
}: CollectionBannerProps) {
    const [collapsed, setCollapsed] = useState(false);

    // Par défaut déplié sauf sur petit écran
    useEffect(() => {
        if (window.innerWidth < 768) setCollapsed(true);
    }, []);

    return (
        <div className={`collection-banner ${collapsed ? "collection-banner--collapsed" : ""}`}>
            <div className="collection-banner__header">
                <h2 className="collection-banner__title" onClick={() => setCollapsed(!collapsed)}>
                    📚 {title}
                    <span className="collection-banner__toggle">
                        {collapsed ? "▼" : "▲"}
                    </span>
                </h2>
                <button className="collection-banner__clear" onClick={onClear}>✖ Tout voir</button>
            </div>

            {!collapsed && (
                <div className="collection-banner__content">
                    {description && <p className="collection-banner__description">{description}</p>}
                    <p className="collection-banner__count">{count} leçons disponibles</p>
                </div>
            )}
        </div>
    );
}
