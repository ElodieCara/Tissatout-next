// ✅ ArticleSelector.tsx
"use client";
import { useState } from "react";

interface ArticleOption {
    id: string;
    title: string;
    category: string;
    ageCategories: string[];
}

interface AgeOption {
    id: string;
    title: string;
}

interface ArticleSelectorProps {
    allArticles: ArticleOption[];
    selectedIds: string[];
    onChange: (selected: string[]) => void;
    ageOptions: AgeOption[];
}

export default function ArticleSelector({ allArticles, selectedIds, onChange, ageOptions }: ArticleSelectorProps) {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [ageFilter, setAgeFilter] = useState("");

    const toggleArticle = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((i) => i !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const filteredArticles = allArticles.filter((article) => {
        const matchSearch = article.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoryFilter ? article.category === categoryFilter : true;
        const matchAge = ageFilter ? article.ageCategories.includes(ageFilter) : true;
        return matchSearch && matchCategory && matchAge;
    });

    return (
        <div className="article-selector">
            <h4>Articles liés</h4>

            {/* 🔝 Sélectionnés */}
            {selectedIds.length > 0 && (
                <div className="article-selector__selected">
                    {selectedIds.map((id) => {
                        const article = allArticles.find((a) => a.id === id);
                        if (!article) return null;
                        return (
                            <div key={article.id} className="article-selector__card selected">
                                <span>{article.title}</span>
                                <button type="button" onClick={() => toggleArticle(article.id)}>❌</button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 🔍 Filtres */}
            <div className="article-selector__filters">
                <input
                    type="text"
                    placeholder="🔍 Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">Toutes les catégories</option>
                    <option value="lecture">📘 Lecture</option>
                    <option value="chiffre">🔢 Chiffre</option>
                    <option value="logique">🧩 Logique</option>
                    <option value="mobilité">🚀 Mobilité</option>
                    <option value="craft">✂️ Créatif</option>
                </select>
                <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
                    <option value="">Tous les âges</option>
                    {ageOptions.map((age) => (
                        <option key={age.id} value={age.id}>
                            {age.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* 🧩 Grille des articles */}
            <div className="article-selector__list">
                {filteredArticles.map((article) => (
                    <button
                        key={article.id}
                        type="button"
                        className={`article-selector__item ${selectedIds.includes(article.id) ? "selected" : ""}`}
                        onClick={() => toggleArticle(article.id)}
                    >
                        {article.title}
                    </button>
                ))}
            </div>
        </div>
    );
}
