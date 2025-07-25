"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import SelectWithAdd from "./SelectWithAdd";
import Breadcrumb from "./Breadcrumb";
import { MysteryStatus } from "./MysteryStatus";

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
    printUrl?: string;
    imageUrl: string;
    previewImageUrl?: string;
    isPrintable: boolean;
    printPrice?: number;
    ageMin: number;
    ageMax: number;
    extraImages?: string[];
    themeIds: string[];
    typeIds: string[];
    articleId?: string | null;
    isFeatured: boolean;
    isMystery: boolean,
    mysteryUntil: string | undefined,
}

export default function AdminPrintableForm({ gameId }: { gameId?: string }) {
    const [form, setForm] = useState<PrintableGameForm>({
        title: "",
        description: "",
        pdfUrl: "",
        pdfPrice: 0,
        printUrl: "",
        imageUrl: "",
        isPrintable: false,
        printPrice: undefined,
        ageMin: 3,
        ageMax: 6,
        themeIds: [],
        typeIds: [],
        extraImages: [],
        isFeatured: false,
        isMystery: false,
        mysteryUntil: undefined,
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

                // Conversion correcte de la date mysteryUntil
                let mysteryUntilFormatted = undefined;
                if (data.mysteryUntil) {
                    const date = new Date(data.mysteryUntil);
                    // Format pour datetime-local : YYYY-MM-DDTHH:MM
                    mysteryUntilFormatted = date.toISOString().slice(0, 16);
                }

                setForm({
                    title: data.title,
                    slug: data.slug,
                    description: data.description,
                    pdfUrl: data.pdfUrl,
                    pdfPrice: data.pdfPrice,
                    printUrl: data.printUrl?.trim() === "" ? undefined : data.printUrl?.trim(),
                    imageUrl: data.imageUrl,
                    previewImageUrl: data.previewImageUrl,
                    isPrintable: data.isPrintable,
                    printPrice: data.printPrice,
                    ageMin: data.ageMin,
                    ageMax: data.ageMax,
                    isFeatured: data.isFeatured,
                    themeIds: data.themes.filter((t: any) => t.theme !== null).map((t: any) => t.theme.id),
                    typeIds: data.types.filter((t: any) => t.type !== null).map((t: any) => t.type.id),
                    articleId: data.articleId ?? null,
                    isMystery: data.isMystery,
                    mysteryUntil: mysteryUntilFormatted,
                    extraImages: data.extraImages || [],
                });
            }
        };
        fetchData();
    }, [gameId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;

        let newValue: any;

        if (type === "checkbox") {
            newValue = checked;
        } else if (type === "number") {
            newValue = value === "" ? undefined : parseFloat(value);
            // "2025-06-28T06:00:00.000Z"
        } else if (name === "mysteryUntil") {
            newValue = value;
        } else {
            newValue = value;
        }
        setForm({
            ...form,
            [name]: newValue,
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
            slug: !form.slug || gameId === "new"
                ? generateSlug(form.title, crypto.randomUUID())
                : form.slug,
            themeIds: form.themeIds,
            typeIds: form.typeIds,
            printUrl: form.printUrl?.trim() || undefined,
            printPrice: form.printPrice,
            mysteryUntil: form.mysteryUntil || null, // 👈 AJOUTE ÇA
        };


        console.log("🧾 PAYLOAD ENVOYÉ :", payload);

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

    const handleExtraImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const uploadedUrls: string[] = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) uploadedUrls.push(data.imageUrl);
        }

        setForm({ ...form, extraImages: [...(form.extraImages ?? []), ...uploadedUrls] });
    };


    return (
        <div className="admin-form">
            <Breadcrumb
                selectedTheme="Activités imprimables"
                selectedSubCategory={gameId && gameId !== "new" ? "Modifier" : "Ajouter"}
                onThemeSelect={() => router.push("/admin?section=printable")}
                onSubCategorySelect={() => { }}
            />

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
                    <label htmlFor="previewImageUrl">Image d’aperçu (facultative)</label>
                    <input
                        type="text"
                        id="previewImageUrl"
                        name="previewImageUrl"
                        value={form.previewImageUrl || ""}
                        onChange={handleChange}
                    />
                </div>
                {form.previewImageUrl && (
                    <div className="admin-form__preview">
                        <img
                            src={form.previewImageUrl}
                            alt="Aperçu fiche"
                            style={{ maxWidth: "200px", borderRadius: "0.5rem", marginTop: "0.5rem" }}
                        />
                    </div>
                )}

                <div className="admin-form__upload">
                    <label>Images supplémentaires (optionnel)</label>
                    <input type="file" accept="image/*" multiple onChange={handleExtraImagesUpload} />
                    <div className="preview-thumbs">
                        {form.extraImages?.map((url, index) => (
                            <div key={index} className="thumb-wrapper" style={{ position: 'relative', display: 'inline-block', margin: '0.5em' }}>
                                <img
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                    className="thumb"
                                    style={{ display: 'block', maxWidth: '100px', borderRadius: '4px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Supprime l’URL à cet index
                                        setForm(prev => ({
                                            ...prev,
                                            extraImages: prev.extraImages!.filter((_, i) => i !== index),
                                        }));
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        background: 'rgba(0,0,0,0.5)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '1.2em',
                                        height: '1.2em',
                                        cursor: 'pointer',
                                    }}
                                    aria-label={`Supprimer l’image ${index + 1}`}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                </div>


                <div className="admin-form__group">
                    <label htmlFor="pdfUrl">Lien vers le PDF</label>
                    <input type="text" name="pdfUrl" value={form.pdfUrl} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="pdfPrice">Prix du PDF (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="pdfPrice"
                        value={form.pdfPrice ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="admin-form__group">
                    <label>
                        <input type="checkbox" name="isPrintable" checked={form.isPrintable} onChange={handleChange} />
                        Disponible en version plastifiée ?
                    </label>
                </div>

                {form.isPrintable && (
                    <>
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
                        <div className="admin-form__group">
                            <label htmlFor="printUrl">Lien vers Etsy (version plastifiée)</label>
                            <input
                                type="text"
                                name="printUrl"
                                value={form.printUrl ?? ""}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}


                <div className="admin-form__group">
                    <label>
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={form.isFeatured}
                            onChange={handleChange}
                        />
                        Mettre en vedette sur la page d'accueil ?
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="isMystery"
                            checked={form.isMystery}
                            onChange={handleChange}
                        />
                        Activité mystère cette semaine
                    </label>
                    {form.isMystery && (
                        <div style={{ marginTop: '10px' }}>
                            <label htmlFor="mysteryUntil">Date et heure de révélation :</label>
                            <input
                                type="datetime-local"
                                name="mysteryUntil"
                                value={form.mysteryUntil ? form.mysteryUntil.slice(0, 16) : ""}
                                onChange={handleChange}
                                style={{ display: 'block', marginTop: '5px' }}
                            />
                            <small style={{ color: '#666', fontSize: '0.85em' }}>
                                L'activité sera révélée à cette date/heure
                            </small>
                        </div>
                    )}
                </div>

                <MysteryStatus
                    isMystery={form.isMystery}
                    mysteryUntil={form.mysteryUntil}
                    mysteryStatus={
                        !form.isMystery
                            ? null
                            : !form.mysteryUntil
                                ? "SANS DATE"
                                : new Date(form.mysteryUntil) > new Date()
                                    ? "EN ATTENTE"
                                    : "RÉVÉLÉE"
                    }
                />

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
