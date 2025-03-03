"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/app/admin/components/Breadcrumb";


interface Section {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    sectionId?: string;
    description?: string;
    iconSrc?: string;
    parentId?: string | null;
}

export default function EditCategoryPage() {
    const [name, setName] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [description, setDescription] = useState("");
    const [iconSrc, setIconSrc] = useState("");
    const [parentId, setParentId] = useState("");
    const [sections, setSections] = useState<Section[]>([]);
    const [allCats, setAllCats] = useState<Category[]>([]);
    const [message, setMessage] = useState("");
    const router = useRouter();
    const params = useParams();

    if (!params || !params.id) {
        return <div className="admin-message admin-message--error">❌ Impossible de charger l’ID.</div>;
    }

    const categoryId = params.id as string;

    useEffect(() => {
        async function fetchCategory() {
            try {
                const res = await fetch(`/api/drawings/categories/${categoryId}`);
                const cat = await res.json();
                if (cat.error) {
                    setMessage(cat.error);
                    return;
                }
                setName(cat.name || "");
                setSectionId(cat.sectionId || "");
                setDescription(cat.description || "");
                setIconSrc(cat.iconSrc || "");
                setParentId(cat.parentId || "");
            } catch (err) {
                console.error("Erreur fetch catégorie:", err);
                setMessage("Erreur lors du chargement de la catégorie.");
            }
        }
        fetchCategory();
    }, [categoryId]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [sectionsRes, categoriesRes] = await Promise.all([
                    fetch("/api/drawings/sections"),
                    fetch("/api/drawings/categories")
                ]);
                setSections(await sectionsRes.json());
                setAllCats(await categoriesRes.json());
            } catch (err) {
                console.error("Erreur fetch données:", err);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/drawings/categories/${categoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    sectionId,
                    description,
                    iconSrc,
                    parentId: parentId || null,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setMessage(`❌ Erreur: ${data.error}`);
            } else {
                setMessage("✅ Catégorie mise à jour avec succès !");
                setTimeout(() => router.push("/admin/category"), 1000);
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Erreur lors de la mise à jour.");
        }
    };

    return (
        <div className="admin">
            <Breadcrumb />
            <h2 >📝 Modifier la catégorie</h2>
            {message && <p className={`admin__message ${message.includes("✅") ? "admin__message--success" : "admin__message--error"}`}>{message}</p>}

            <form onSubmit={handleSubmit} className="admin__form">
                <label>🏷️ Nom :</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="admin__form-input" />

                <label>📂 Section :</label>
                <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} required className="admin__form-input">
                    <option value="">-- Sélectionner une section --</option>
                    {sections.map((sec) => (
                        <option key={sec.id} value={sec.id}>{sec.name}</option>
                    ))}
                </select>

                <label>📂 Sous-catégorie :</label>
                <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="admin__form-input">
                    <option value="">-- Aucune (catégorie principale) --</option>
                    {allCats.filter((cat) => cat.id !== categoryId).map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <button type="submit" className="admin__button">
                    ✅ Enregistrer
                </button>
            </form>
        </div>
    );
}
