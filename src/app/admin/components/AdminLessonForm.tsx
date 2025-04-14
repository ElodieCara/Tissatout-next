"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { generateSlug } from "@/lib/utils";
import type { Lesson as BaseLesson } from "@/types/lessons";
import Breadcrumb from "./Breadcrumb";

interface Props {
    lessonId?: string;
}

type Lesson = BaseLesson & {
    module: "trivium" | "quadrivium";
};

export default function AdminLessonForm({ lessonId }: Props) {
    const [form, setForm] = useState<Partial<Lesson> & { module?: "trivium" | "quadrivium" }>({
        order: 1,
        title: "",
        slug: "",
        chapterTitle: "",
        personageName: "",
        personageDates: "",
        personageNote: "",
        collectionId: "",
        category: "",
        module: "trivium",
        subcategory: "",
        summary: "",
        period: "",
        content: "",
        revision: "",
        homework: "",
        image: "",
        published: false,
        ageTag: null,
    });

    const router = useRouter();
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [collections, setCollections] = useState<{ id: string; title: string; module: "trivium" | "quadrivium" }[]>([]);
    const [showAddCollection, setShowAddCollection] = useState(false);
    const [newCollectionTitle, setNewCollectionTitle] = useState("");
    const categoryOptions = form.module === "quadrivium"
        ? ["Arithmétique", "Géométrie", "Musique", "Astronomie"]
        : ["Grammaire", "Logique", "Rhétorique"];

    const handleCreateCollection = async () => {
        if (!newCollectionTitle.trim()) return;

        const slug = generateSlug(newCollectionTitle);

        const res = await fetch("/api/collections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newCollectionTitle,
                slug,
                module: form.module || "trivium", // par défaut trivium
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setCollections((prev) => [...prev, data]);
            setForm((prev) => ({ ...prev, collectionId: data.id }));
            setNewCollectionTitle("");
            setShowAddCollection(false);
        } else {
            alert("Erreur: " + (data.error || "Inconnue"));
        }
    };

    const handleDeleteCollection = async () => {
        if (!form.collectionId) return;

        const confirm = window.confirm("Supprimer cette collection ? Cela supprimera aussi toutes les leçons liées.");
        if (!confirm) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/collections/${form.collectionId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setCollections((prev) => prev.filter(c => c.id !== form.collectionId));
                setForm((prev) => ({ ...prev, collectionId: "" }));
                setMessage("✅ Collection supprimée.");
            } else {
                const data = await res.json();
                setMessage(`❌ Erreur : ${data.error || res.statusText}`);
            }
        } catch (err) {
            setMessage("❌ Erreur lors de la suppression.");
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Chargement de la leçon si ID présent
    useEffect(() => {
        if (lessonId && lessonId !== "new") {
            setIsLoading(true);
            // Vérifiez que cette URL correspond à la structure de votre API
            fetch(`/api/modules/${lessonId}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Erreur de chargement: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log("Données chargées:", data);
                    setForm(data);
                    setMessage("Leçon chargée avec succès");
                })
                .catch((error) => {
                    console.error("Erreur lors du chargement:", error);
                    setMessage(`❌ Erreur lors du chargement: ${error.message}`);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [lessonId]);

    // 🔹 Chargement des collections
    useEffect(() => {
        fetch("/api/collections")
            .then((res) => res.json())
            .then((data) => setCollections(data))
            .catch((err) => console.error("Erreur de chargement des collections:", err));
    }, []);

    // 🔹 Slug auto uniquement si nouvelle leçon
    useEffect(() => {
        if (!lessonId || lessonId === "new") {
            setForm((prev) => ({
                ...prev,
                slug: generateSlug(prev.title || ""),
            }));
        }
    }, [form.title, lessonId]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === "order" ? parseInt(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const isEdit = lessonId && lessonId !== "new";
        const method = isEdit ? "PUT" : "POST";
        const url = isEdit ? `/api/modules/${lessonId}` : `/api/modules`;

        // Préparer les données nettoyées
        const payload = {
            ...form,
            title: form.title?.trim(),
            slug: form.slug?.trim(),
            category: form.category?.trim(),
            subcategory: form.subcategory?.trim().toLowerCase() || "",
            published: form.published ?? false,
        };

        // Ne jamais envoyer l'id dans un POST
        if (!isEdit) {
            delete (payload as any).id;
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setMessage("✅ Leçon enregistrée !");
                setTimeout(() => router.push("/admin/lessons"), 1000);
            } else {
                const errorData = await res.json();
                setMessage(`❌ Erreur lors de l'enregistrement: ${errorData.error || res.statusText}`);
            }
        } catch (error) {
            setMessage(`❌ Erreur: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Gérer l'upload d'image
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();

            if (res.ok) {
                setForm({ ...form, image: data.imageUrl });
                setMessage("✅ Image uploadée !");
            } else {
                setMessage(`❌ Erreur lors de l'upload: ${data.error || res.statusText}`);
            }
        } catch (error) {
            setMessage(`❌ Erreur: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-form">
            <Breadcrumb
                selectedTheme="Modules"
                selectedSubCategory={lessonId && lessonId !== "new" ? "Modifier" : "Nouvelle leçon"}
                onThemeSelect={() => router.push("/admin?section=modules")}
                onSubCategorySelect={() => { }}
            />
            <h2>{lessonId && lessonId !== "new" ? "Modifier la leçon" : "Ajouter une nouvelle leçon"}</h2>
            {message && <p className={`admin-form__message ${message.includes("❌") ? "error" : "success"}`}>{message}</p>}
            {isLoading && <p className="admin-form__loading">Chargement en cours...</p>}

            <form onSubmit={handleSubmit}>
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input type="text" id="title" name="title" value={form.title || ""} onChange={handleChange} placeholder="Titre" required />
                </div>

                {/* Upload d'image */}
                <div className="admin-form__upload">
                    <label htmlFor="imageUpload">📸 Glissez une image ici ou cliquez</label>
                    <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
                    {form.image && <img src={form.image} alt="Aperçu" />}
                </div>

                <div className="admin-form__group">
                    <label htmlFor="order">Numéro d'ordre</label>
                    <input type="number" id="order" name="order" value={form.order || 1} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="chapterTitle">Titre du chapitre</label>
                    <input type="text" id="chapterTitle" name="chapterTitle" value={form.chapterTitle || ""} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="personageName">Nom du personnage</label>
                    <input type="text" id="personageName" name="personageName" value={form.personageName || ""} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="personageDates">Dates du personnage</label>
                    <input type="text" id="personageDates" name="personageDates" value={form.personageDates || ""} onChange={handleChange} />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="personageNote">Note sur le personnage</label>
                    <input type="text" id="personageNote" name="personageNote" value={form.personageNote || ""} onChange={handleChange} />
                </div>

                <div className="admin-form__group admin-form__group--collection">
                    <label htmlFor="collectionId">Collection</label>
                    <div className="admin-form__inline">
                        <select
                            id="collectionId"
                            name="collectionId"
                            value={form.collectionId || ""}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Sélectionner une collection</option>
                            {collections.map((col) => (
                                <option key={col.id} value={col.id}>
                                    {col.title}
                                </option>
                            ))}

                        </select>
                        <p className="admin-form__hint">
                            Module : <strong>{collections.find(c => c.id === form.collectionId)?.module || "—"}</strong>
                        </p>
                        {form.collectionId && (
                            <button
                                type="button"
                                className="admin-form__delete-button"
                                onClick={handleDeleteCollection}
                                title="Supprimer cette collection"
                            >
                                ➖
                            </button>
                        )}
                        <button
                            type="button"
                            className="admin-form__icon-button"
                            onClick={() => setShowAddCollection(true)}
                            title="Ajouter une nouvelle collection"
                        >
                            ➕
                        </button>
                    </div>
                </div>

                {showAddCollection && (
                    <div className="admin-form__group admin-form__group--new-collection">
                        <input
                            type="text"
                            placeholder="Nom de la nouvelle collection"
                            value={newCollectionTitle}
                            onChange={(e) => setNewCollectionTitle(e.target.value)}
                        />

                        <button onClick={handleCreateCollection} type="button">Créer</button>
                        <button onClick={() => setShowAddCollection(false)} type="button">Annuler</button>
                    </div>
                )}

                <div className="admin-form__group">
                    <label htmlFor="module">Module</label>
                    <select
                        id="module"
                        name="module"
                        value={form.module || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Sélectionner le module</option>
                        <option value="trivium">Trivium</option>
                        <option value="quadrivium">Quadrivium</option>
                    </select>
                </div>

                <div className="admin-form__group">
                    <label htmlFor="category">Catégorie</label>
                    <select
                        id="category"
                        name="category"
                        value={form.category || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Sélectionner une catégorie</option>
                        {categoryOptions.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="admin-form__group">
                    <label htmlFor="ageTag">Tranche d’âge</label>
                    <select id="ageTag" name="ageTag" value={form.ageTag || ""} onChange={handleChange}>
                        <option value="">—</option>
                        <option value="3 ans et +">3 ans et +</option>
                        <option value="5 ans et +">5 ans et +</option>
                        <option value="6 ans et +">6 ans et +</option>
                        <option value="7 ans et +">7 ans et +</option>
                        <option value="8 ans et +">8 ans et +</option>
                        <option value="9 ans et +">9 ans et +</option>
                        <option value="10 ans et +">10 ans et +</option>
                    </select>
                </div>

                <div className="admin-form__group">
                    <label htmlFor="period">Période historique (facultatif)</label>
                    <select id="period" name="period" value={form.period || ""} onChange={handleChange}>
                        <option value="">—</option>
                        <option value="Préhistoire">Préhistoire</option>
                        <option value="Antiquité">Antiquité</option>
                        <option value="Moyen Âge">Moyen Âge</option>
                        <option value="Renaissance">Renaissance</option>
                        <option value="Temps modernes">Temps modernes</option>
                        <option value="Époque contemporaine">Époque contemporaine</option>
                    </select>
                </div>

                <div className="admin-form__group">
                    <label htmlFor="subcategory">Sous-catégorie (optionnelle)</label>
                    <input type="text" id="subcategory" name="subcategory" value={form.subcategory || ""} onChange={handleChange} />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="summary">Résumé</label>
                    <textarea id="summary" name="summary" value={form.summary || ""} onChange={handleChange} />
                </div>

                {/* Sections */}
                <div className="admin-form__group">
                    <label htmlFor="content">Contenu de la leçon (Markdown)</label>
                    <textarea
                        id="content"
                        name="content"
                        value={form.content || ""}
                        onChange={handleChange}
                        rows={10}
                        required
                    />
                    <div className="markdown-preview">
                        <ReactMarkdown>{form.content || ""}</ReactMarkdown>
                    </div>
                </div>

                <div className="admin-form__group">
                    <label htmlFor="revision">Révision (facultatif)</label>
                    <textarea
                        id="revision"
                        name="revision"
                        value={form.revision || ""}
                        onChange={handleChange}
                        rows={6}
                    />
                    <div className="markdown-preview">
                        <ReactMarkdown>{form.revision || ""}</ReactMarkdown>
                    </div>
                </div>

                <div className="admin-form__group">
                    <label htmlFor="homework">Devoirs à faire (facultatif)</label>
                    <textarea
                        id="homework"
                        name="homework"
                        value={form.homework || ""}
                        onChange={handleChange}
                        rows={6}
                    />
                    <div className="markdown-preview">
                        <ReactMarkdown>{form.homework || ""}</ReactMarkdown>
                    </div>
                </div>

                <div className="admin-form__group">
                    <label htmlFor="published">
                        <input
                            type="checkbox"
                            id="published"
                            name="published"
                            checked={form.published}
                            onChange={(e) => setForm({ ...form, published: e.target.checked })}
                        />
                        Publier la leçon
                    </label>
                </div>

                <button
                    type="submit"
                    className="admin-form__button"
                    disabled={isLoading}
                >
                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                </button>
            </form>
        </div>
    );
}