"use client";
import React, { useState } from "react";

export interface ColoringOption {
    id: string;
    title: string;
    imageUrl: string;
}

interface ColoringSelectorProps {
    label: string;
    allColorings: ColoringOption[];
    selectedId: string;
    onChange: (id: string) => void;
}

export default function ColoringSelector({
    label,
    allColorings,
    selectedId,
    onChange,
}: ColoringSelectorProps) {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        const match = allColorings.find((c) => c.title === value);
        onChange(match ? match.id : "");
    };

    const selected = allColorings.find((c) => c.id === selectedId);

    return (
        <div className="coloring-selector" style={{ marginBottom: 16 }}>
            <label
                className="coloring-selector__label"
                style={{ display: "block", marginBottom: 4 }}
            >
                {label}
            </label>

            {/* Input + datalist for dropdown & search */}
            <input
                list="coloring-options"
                placeholder="Recherche ou sélection…"
                value={selected ? selected.title : inputValue}
                onChange={handleInputChange}
                style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 8,
                    boxSizing: "border-box",
                }}
            />
            <datalist id="coloring-options">
                {allColorings.map((c) => (
                    <option key={c.id} value={c.title} />
                ))}
            </datalist>

            {/* Preview of selected option */}
            {selected && (
                <div
                    className="coloring-selector__preview"
                    style={{ textAlign: "center", marginTop: 8 }}
                >
                    <img
                        src={selected.imageUrl}
                        alt={selected.title}
                        style={{ maxWidth: "100%", borderRadius: 4, marginBottom: 4 }}
                    />
                    <div style={{ fontSize: 14 }}>{selected.title}</div>
                </div>
            )}
        </div>
    );
}
