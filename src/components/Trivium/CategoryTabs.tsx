"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface CategoryTabsProps {
    selected: string;
    onChange: (category: string) => void;
    categories: { key: string; label: string }[];
    module: "trivium" | "quadrivium"; // 🔄 On passe le module pour différencier
}

export default function CategoryTabs({ selected, onChange, categories, module }: CategoryTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleCategoryChange = (key: string) => {
        onChange(key);

        // 🔄 Mise à jour de l'URL avec le bon paramètre
        const currentParams = new URLSearchParams(searchParams as any);
        currentParams.set("category", key);

        router.push(`/${module}?${currentParams.toString()}`);
    };

    return (
        <div className="category-tabs">
            {categories.map(({ key, label }) => (
                <button
                    key={key}
                    className={`category-tabs__tab ${selected === key ? "category-tabs__tab--active" : ""}`}
                    onClick={() => handleCategoryChange(key)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
