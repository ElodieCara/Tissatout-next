"use client";

import { useState } from "react";

interface Option {
    id: string;
    label: string;
}

interface SelectWithAddProps {
    label: string; // ex : "Thèmes"
    resource: string; // ex : "themes" ou "types" → pour l’URL de l’API
    options: Option[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    onAdd: (label: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function SelectWithAdd({
    label,
    resource,
    options,
    selectedIds,
    onChange,
    onAdd,
    onDelete,
}: SelectWithAddProps) {
    const [showAdd, setShowAdd] = useState(false);
    const [newLabel, setNewLabel] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!newLabel.trim()) return;
        setLoading(true);
        await onAdd(newLabel.trim());
        setLoading(false);
        setNewLabel("");
        setShowAdd(false);
    };

    const handleRemoveFromSelection = (id: string) => {
        onChange(selectedIds.filter((sid) => sid !== id));
    };

    const handleDeleteGlobal = async (id: string) => {
        const confirmDelete = confirm(
            `Supprimer définitivement ce ${label.slice(0, -1).toLowerCase()} ? Il sera retiré de tous les jeux.`
        );
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/${resource}/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.message);
                return;
            }

            await onDelete(id);
        } catch (e) {
            alert("Erreur lors de la suppression.");
        }
    };



    return (
        <div className="select-add">
            <label className="select-add__label">{label}</label>

            {/* Tags sélectionnés */}
            <div className="select-add__selected">
                {selectedIds.map((id) => {
                    const option = options.find((opt) => opt.id === id);
                    if (!option) return null;

                    return (
                        <span key={id} className="select-add__tag">
                            {option.label}
                            <button
                                type="button"
                                onClick={() => handleRemoveFromSelection(id)}
                                className="select-add__tag-delete"
                                title="Retirer ce tag de cette activité"
                            >
                                ✖
                            </button>
                        </span>
                    );
                })}
            </div>

            {/* Sélecteur pour ajouter un tag existant */}
            <div className="select-add__row">
                <select
                    className="select-add__select"
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value && !selectedIds.includes(value)) {
                            onChange([...selectedIds, value]);
                        }
                        e.target.value = "";
                    }}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Ajouter un {label.slice(0, -1).toLowerCase()}
                    </option>
                    {options
                        .filter((opt) => !selectedIds.includes(opt.id))
                        .map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.label}
                            </option>
                        ))}
                </select>

                <button
                    type="button"
                    onClick={() => setShowAdd((prev) => !prev)}
                    className="select-add__button"
                    title="Créer un nouveau tag"
                >
                    +
                </button>
            </div>

            {/* Champ pour créer un nouveau tag */}
            {showAdd && (
                <div className="select-add__add">
                    <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder={`Ajouter un nouveau ${label.slice(0, -1).toLowerCase()}`}
                        className="select-add__input"
                    />
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={loading}
                        className="select-add__validate"
                    >
                        Valider
                    </button>
                </div>
            )}

            {/* Liste des tags existants avec bouton de suppression globale */}
            <div className="select-add__existing">
                <p className="select-add__existing-title">Tous les {label.toLowerCase()}</p>
                <ul>
                    {options.map((opt) => (
                        <li key={opt.id} className="select-add__existing-item">
                            {opt.label}
                            <button
                                type="button"
                                onClick={() => handleDeleteGlobal(opt.id)}
                                className="select-add__existing-delete"
                                title="Supprimer globalement"
                            >
                                🗑️
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
