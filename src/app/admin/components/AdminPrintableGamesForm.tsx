"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import SelectWithAdd from "./SelectWithAdd";


interface Theme {
    id: string;
    label: string;
}

interface Type {
    id: string;
    label: string;
}

interface PrintableGameForm {
    title: string;
    slug?: string;
    description: string;
    pdfUrl: string;
    pdfPrice?: number;
    imageUrl: string;
    isPrintable: boolean;
    printPrice?: number;
    ageMin: number;
    ageMax: number;
    themeIds: string[];
    typeIds: string[];
    articleId?: string | null;
    isFeatured: boolean;
}

export default function AdminPrintableForm({ gameId }: { gameId?: string }) {
    const [form, setForm] = useState<PrintableGameForm>({
        title: "",
        description: "",
        pdfUrl: "",
        pdfPrice: 0,
        imageUrl: "",
        isPrintable: false,
        printPrice: undefined,
        ageMin: 3,
        ageMax: 6,
        themeIds: [],
        typeIds: [],
        isFeatured: false,
    });

    const [themes, setThemes] = useState<Theme[]>([]);
    const [types, setTypes] = useState<Type[]>([]);
    const [message, setMessage] = useState("");
    const [articles, setArticles] = useState<{ id: string; title: string }[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const [themeRes, typeRes] = await Promise.all([
                fetch("/api/themes"),
                fetch("/api/types"),
            ]);
            const [themeData, typeData] = await Promise.all([
                themeRes.json(),
                typeRes.json(),
            ]);
            setThemes(themeData);
            setTypes(typeData);

            const articleRes = await fetch("/api/articles");
            const articleData = await articleRes.json();

            setArticles(articleData.map((a: any) => ({
                id: a.id,
                title: a.title,
            })));

            if (gameId && gameId !== "new") {
                const res = await fetch(`/api/printable/${gameId}`);
                const data = await res.json();
                setForm({
                    title: data.title,
                    slug: data.slug,
                    description: data.description,
                    pdfUrl: data.pdfUrl,
                    pdfPrice: data.pdfPrice,
                    imageUrl: data.imageUrl,
                    isPrintable: data.isPrintable,
                    printPrice: data.printPrice,
                    ageMin: data.ageMin,
                    ageMax: data.ageMax,
                    isFeatured: data.isFeatured,
                    themeIds: data.themes.filter((t: any) => t.theme !== null).map((t: any) => t.theme.id),
                    typeIds: data.types.filter((t: any) => t.type !== null).map((t: any) => t.type.id),
                    articleId: data.articleId ?? null,
                });
            }
        };
        fetchData();
    }, [gameId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) {
            setForm({ ...form, imageUrl: data.imageUrl });
        } else {
            setMessage("Erreur lors de l'upload de l'image");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = gameId && gameId !== "new" ? "PUT" : "POST";
        const url = gameId && gameId !== "new" ? `/api/printable/${gameId}` : "/api/printable";

        const payload = {
            ...form,
            slug: gameId === "new" ? generateSlug(form.title, crypto.randomUUID()) : form.slug,
            themeIds: form.themeIds,
            typeIds: form.typeIds
        };

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setMessage("✅ Activité enregistrée");
            setTimeout(() => router.push("/admin?section=printable"), 1000);
        } else {
            setMessage("❌ Erreur lors de l'enregistrement");
        }
    };

    return (
        <div className="admin-form">
            <h2>{gameId === "new" ? "Ajouter une activité" : "Modifier l'activité"}</h2>
            {message && <p className="admin-form__message">{message}</p>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input type="text" id="title" name="title" value={form.title} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={form.description} onChange={handleChange} />
                </div>

                <div className="admin-form__upload">
                    <label htmlFor="image">Image du produit</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {form.imageUrl && <img src={form.imageUrl} alt="Aperçu" />}
                </div>

                <div className="admin-form__group">
                    <label htmlFor="pdfUrl">Lien vers le PDF</label>
                    <input type="text" name="pdfUrl" value={form.pdfUrl} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="price">Prix du PDF (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={form.pdfPrice ?? ""}
                        onChange={(e) => setForm({ ...form, pdfPrice: parseFloat(e.target.value) })}
                    />
                </div>

                <div className="admin-form__group">
                    <label>
                        <input type="checkbox" name="isPrintable" checked={form.isPrintable} onChange={handleChange} />
                        Disponible en version plastifiée ?
                    </label>
                </div>

                {form.isPrintable && (
                    <div className="admin-form__group">
                        <label htmlFor="printPrice">Prix version plastifiée (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="printPrice"
                            value={form.printPrice ?? ""}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <div className="admin-form__group">
                    <label>
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={form.isFeatured}
                            onChange={handleChange}
                        />
                        Mettre en vedette sur la page d’accueil ?
                    </label>
                </div>

                <div className="admin-form__group">
                    <label>Tranche d’âge</label>
                    <div className="admin-form__age-range">
                        <input type="number" name="ageMin" value={form.ageMin} onChange={handleChange} />
                        <input type="number" name="ageMax" value={form.ageMax} onChange={handleChange} />
                    </div>
                </div>

                <SelectWithAdd
                    label="Thèmes"
                    resource="themes"
                    options={themes}
                    selectedIds={form.themeIds}
                    onChange={(ids) => setForm({ ...form, themeIds: ids })}
                    onAdd={async (label) => {
                        const res = await fetch("/api/themes", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ label }),
                        });
                        const newTag = await res.json();
                        setThemes((prev) => [...prev, newTag]);
                    }}
                    onDelete={async (id) => {
                        setThemes((prev) => prev.filter((t) => t.id !== id));
                        setForm((prev) => ({ ...prev, themeIds: prev.themeIds.filter((tid) => tid !== id) }));
                    }}
                />

                <SelectWithAdd
                    label="Types"
                    resource="types"
                    options={types}
                    selectedIds={form.typeIds}
                    onChange={(ids) => setForm({ ...form, typeIds: ids })}
                    onAdd={async (label) => {
                        const res = await fetch("/api/types", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ label }),
                        });
                        const newTag = await res.json();
                        setTypes((prev) => [...prev, newTag]);
                    }}
                    onDelete={async (id) => {
                        setTypes((prev) => prev.filter((t) => t.id !== id));
                        setForm((prev) => ({ ...prev, typeIds: prev.typeIds.filter((tid) => tid !== id) }));
                    }}
                />


                {form.articleId && (
                    <div className="admin-form__group admin-form__info">
                        🔗 Ce jeu est actuellement lié à un article.
                    </div>
                )}

                <button type="submit" className="admin-form__button">
                    {gameId === "new" ? "Ajouter" : "Mettre à jour"}
                </button>
            </form>
        </div>
    );
}
