"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "../../../components/Breadcrumb";

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
    const router = useRouter();
    const params = useParams<{ id?: string }>();
    const categoryId = typeof params?.id === "string" ? params.id : undefined;

    const [name, setName] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [description, setDescription] = useState("");
    const [iconSrc, setIconSrc] = useState("");
    const [parentId, setParentId] = useState("");
    const [sections, setSections] = useState<Section[]>([]);
    const [allCats, setAllCats] = useState<Category[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // Charge la catégorie ciblée (garde DANS l'effet)
    useEffect(() => {
        if (!categoryId) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const res = await fetch(`/api/drawings/categories/${categoryId}`);
                if (!res.ok) throw new Error("Fetch category failed");
                const cat: Category & Partial<Category> & Record<string, any> = await res.json();

                if (cat?.error) {
                    if (!cancelled) setMessage(String(cat.error));
                    return;
                }

                if (!cancelled) {
                    setName(cat.name || "");
                    setSectionId(cat.sectionId || "");
                    setDescription(cat.description || "");
                    setIconSrc(cat.iconSrc || "");
                    setParentId((cat.parentId as string) || "");
                }
            } catch (err) {
                console.error("Erreur fetch catégorie:", err);
                if (!cancelled) setMessage("Erreur lors du chargement de la catégorie.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [categoryId]);

    // Charge sections et catégories (toujours appelé, pas conditionné)
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const [sectionsRes, categoriesRes] = await Promise.all([
                    fetch("/api/drawings/sections"),
                    fetch("/api/drawings/categories"),
                ]);

                if (!sectionsRes.ok || !categoriesRes.ok) throw new Error("Fetch lists failed");

                const [sectionsJson, catsJson] = await Promise.all([sectionsRes.json(), categoriesRes.json()]);
                if (!cancelled) {
                    setSections(sectionsJson);
                    setAllCats(catsJson);
                }
            } catch (err) {
                console.error("Erreur fetch données:", err);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId) {
            setMessage("❌ Impossible de mettre à jour sans identifiant.");
            return;
        }

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
                setMessage(`❌ Erreur: ${data?.error ?? "Mise à jour impossible"}`);
            } else {
                setMessage("✅ Catégorie mise à jour avec succès !");
                setTimeout(() => router.push("/admin/category"), 1000);
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Erreur lors de la mise à jour.");
        }
    };

    // 👉 Rendu conditionnel APRÈS les hooks
    if (loading) {
        return <div className="admin-message">Chargement…</div>;
    }

    if (!categoryId) {
        return <div className="admin-message admin-message--error">❌ Impossible de charger l’ID.</div>;
    }

    return (
        <div className="admin">
            <Breadcrumb
                onThemeSelect={(theme) => console.log("Thème sélectionné:", theme)}
                onSubCategorySelect={(subCategory) => console.log("Sous-catégorie sélectionnée:", subCategory)}
            />

            <h2>📝 Modifier la catégorie</h2>

            {message && (
                <p
                    className={`admin__message ${message.includes("✅") ? "admin__message--success" : "admin__message--error"
                        }`}
                >
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} className="admin__form">
                <label>🏷️ Nom :</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="admin__form-input" />

                <label>📂 Section :</label>
                <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} required className="admin__form-input">
                    <option value="">-- Sélectionner une section --</option>
                    {sections.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                            {sec.name}
                        </option>
                    ))}
                </select>

                <label>📂 Sous-catégorie :</label>
                <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="admin__form-input">
                    <option value="">-- Aucune (catégorie principale) --</option>
                    {allCats
                        .filter((cat) => cat.id !== categoryId)
                        .map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                </select>

                <button type="submit" className="admin__button">
                    ✅ Enregistrer
                </button>
            </form>
        </div>
    );
}
