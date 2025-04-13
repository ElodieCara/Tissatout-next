"use client";

interface CategoryTabsProps {
    selected: string;
    onChange: (category: string) => void;
}

const categories = [
    { key: "Grammaire", label: "📖 Grammaire" },
    { key: "Logique", label: "🧠 Logique" },
    { key: "Rhétorique", label: "🗣️ Rhétorique" },
];

export default function CategoryTabs({ selected, onChange }: CategoryTabsProps) {
    return (
        <div className="category-tabs">
            {categories.map(({ key, label }) => (
                <button
                    key={key}
                    className={`category-tabs__tab ${selected === key ? "category-tabs__tab--active" : ""}`}
                    onClick={() => onChange(key)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}