"use client";

import { useState, useEffect } from "react";

interface FilterProps {
    themes: string[];
    types: string[];
    onFilterChange: (filters: {
        age: string;
        selectedThemes: string[];
        selectedTypes: string[];
        priceFilter: "all" | "free" | "asc" | "desc";
    }) => void;
}

const AGE_GROUPS = ["all", "3–4", "5–6", "7–8", "9–10"];

export default function ActivityFilter({ themes, types, onFilterChange }: FilterProps) {
    const [age, setAge] = useState("all");
    const [selectedTheme, setSelectedTheme] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [priceFilter, setPriceFilter] = useState<"all" | "free" | "asc" | "desc">("all");

    useEffect(() => {
        onFilterChange({
            age,
            selectedThemes: selectedTheme ? [selectedTheme] : [],
            selectedTypes: selectedType ? [selectedType] : [],
            priceFilter,
        });
    }, [age, selectedTheme, selectedType, priceFilter]);

    const resetFilters = () => {
        setAge("all");
        setSelectedTheme("");
        setSelectedType("");
        setPriceFilter("all");
    };

    return (
        <div className="activity-filter--bar">
            <div className="filter-group">
                <label htmlFor="age">Âge</label>
                <select id="age" value={age} onChange={(e) => setAge(e.target.value)}>
                    {AGE_GROUPS.map((g) => (
                        <option key={g} value={g}>
                            {g === "all" ? "Tous" : `${g} ans`}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="theme">Thème</label>
                <select id="theme" value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
                    <option value="">Tous</option>
                    {themes.map((theme) => (
                        <option key={theme} value={theme}>{theme}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="type">Type</label>
                <select id="type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <option value="">Tous</option>
                    {types.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="price">Prix</label>
                <select
                    id="price"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value as any)}
                >
                    <option value="all">Tous</option>
                    <option value="free">Gratuit</option>
                    <option value="asc">↑ Prix</option>
                    <option value="desc">↓ Prix</option>
                </select>
            </div>

            <button
                type="button"
                onClick={resetFilters}
                className="reset-btn"
                title="Réinitialiser les filtres"
            >
                <img src="/icons/refresh.png" alt="Réinitialiser" width="24" height="24" />
            </button>
        </div>
    );
}
