"use client";

import { useEffect, useState } from "react";

interface Tag {
    id: string;
    label: string;
}

export default function TagManager({ params }: { params: { resource: string } }) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [newLabel, setNewLabel] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedLabel, setEditedLabel] = useState("");

    const fetchTags = async () => {
        const res = await fetch(`/api/${params.resource}`);
        const data = await res.json();
        setTags(data);
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleAdd = async () => {
        if (!newLabel.trim()) return;
        const res = await fetch(`/api/${params.resource}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: newLabel }),
        });
        if (res.ok) {
            setNewLabel("");
            fetchTags();
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Supprimer définitivement ce tag ?");
        if (!confirmDelete) return;

        const res = await fetch(`/api/${params.resource}/${id}`, { method: "DELETE" });
        if (res.ok) {
            setTags((prev) => prev.filter((tag) => tag.id !== id));
        } else {
            const data = await res.json();
            alert(data.message);
        }
    };

    const handleEdit = async (id: string) => {
        const res = await fetch(`/api/${params.resource}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: editedLabel }),
        });
        if (res.ok) {
            setEditingId(null);
            fetchTags();
        }
    };

    return (
        <div className="tag-manager">
            <h2>Gérer les {params.resource}</h2>

            <div className="tag-manager__add">
                <input
                    type="text"
                    placeholder="Ajouter un nouveau tag"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                />
                <button onClick={handleAdd}>Ajouter</button>
            </div>

            <ul className="tag-manager__list">
                {tags.map((tag) => (
                    <li key={tag.id}>
                        {editingId === tag.id ? (
                            <>
                                <input
                                    value={editedLabel}
                                    onChange={(e) => setEditedLabel(e.target.value)}
                                />
                                <button onClick={() => handleEdit(tag.id)}>💾</button>
                                <button onClick={() => setEditingId(null)}>✖</button>
                            </>
                        ) : (
                            <>
                                {tag.label}
                                <button onClick={() => {
                                    setEditingId(tag.id);
                                    setEditedLabel(tag.label);
                                }}>✎</button>
                                <button onClick={() => handleDelete(tag.id)}>🗑️</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
