"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "../components/Breadcrumb";
import { generateSlug } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import ArticleSelector from "./ArticleSelector";
import type { ArticleOption } from "@/types/articles";


// 🎨 Icônes associées aux catégories
const categoryIcons: Record<string, string> = {
    "lecture": "/icons/lecture.png",
    "chiffre": "/icons/chiffre.png",
    "logique": "/icons/logique.png",
    "mobilité": "/icons/mobilite.png",
    "craft": "/icons/crafts.png",
    "histoire": "/icons/redaction.png",
    "savoirs": "/icons/telescope.png"
};

interface Section {
    title: string;
    content: string;
    style?: string;
}

interface Article {
    id?: string;
    slug?: string;
    title: string;
    content: string;
    image?: string;
    iconSrc?: string;
    category: string;
    tags?: string[];
    author: string;
    description?: string;
    date?: string;
    ageCategories?: string[];
    sections: Section[];
    printableSupport?: string;
    relatedArticleIds?: string[];
    printableGameId?: string | null;
}

export default function AdminArticleForm({ articleId }: { articleId?: string }) {
    const [form, setForm] = useState<Article>({
        title: "",
        content: "",
        image: "",
        iconSrc: "",
        category: "",
        tags: [],
        author: "",
        description: "",
        date: "",
        ageCategories: [],
        sections: [
            { title: "", content: "", style: "" }
        ],
        printableSupport: "",
        relatedArticleIds: []
    });

    const [message, setMessage] = useState("");
    const router = useRouter();
    const [selectedAges, setSelectedAges] = useState<string[]>([]);
    const [ageCategories, setAgeCategories] = useState<{ id: string; title: string }[]>([]);
    const [allArticles, setAllArticles] = useState<ArticleOption[]>([]);
    const [printableGames, setPrintableGames] = useState<{ id: string; title: string; slug: string }[]>([]);

    // 🟢 Charger l'article en modification
    useEffect(() => {
        async function fetchData() {
            // → Étape 0.5 : Charger tous les jeux imprimables
            const printableRes = await fetch("/api/printable");
            const printableData = await printableRes.json();
            setPrintableGames(printableData);
            // 🟡 Étape 1 : Charger tous les articles sauf l'actuel
            const allRes = await fetch("/api/articles");
            const allData = await allRes.json();
            const gameRes = await fetch("/api/printable");
            const gameData = await gameRes.json();


            const otherArticles = allData
                .filter((a: any) => a.id !== articleId)
                .map((a: any) => {
                    const mapped = {
                        id: a.id,
                        title: a.title,
                        category: a.category,
                        ageCategories: a.ageCategories?.map((ac: any) => ac.ageCategory.id) || [],
                    };
                    console.log(`[DEBUG] Article "${a.title}" - Ages:`, mapped.ageCategories);
                    return mapped;
                });

            console.log("Articles envoyés à ArticleSelector (ageCategories sous forme d’ID):", otherArticles);
            setAllArticles(otherArticles);


            // 🟡 Étape 2 : Charger l’article si en modification
            if (articleId && articleId !== "new") {
                const res = await fetch(`/api/articles/${articleId}`);
                const data = await res.json();

                const fetchedArticle = {
                    title: data.title || "",
                    content: data.content || "",
                    image: data.image || "",
                    iconSrc: data.iconSrc || categoryIcons[data.category] || "",
                    category: data.category || "",
                    tags: data.tags || [],
                    author: data.author || "",
                    description: data.description || "",
                    printableSupport: data.printableSupport || "",
                    date: data.date ? data.date.substring(0, 10) : "",
                    ageCategories: data.ageCategories?.map((ac: any) => ac.ageCategory.id) || [],
                    sections: Array.isArray(data.sections) && data.sections.length > 0
                        ? data.sections
                        : [{ title: "", content: "" }],
                    relatedArticleIds: data.relatedArticles?.map((a: any) => a.id) || [],
                    printableGameId: data.printableGameId || null // 🟢 AJOUT ICI
                };

                if (Array.isArray(gameData)) {
                    setPrintableGames(gameData.map((g: any) => ({ id: g.id, title: g.title, slug: g.slug })));
                } else {
                    console.warn("❌ gameData n'est pas un tableau :", gameData);
                    setPrintableGames([]); // On met une liste vide plutôt que de planter
                }
                setForm(fetchedArticle);
                setSelectedAges(fetchedArticle.ageCategories);
            }

            // 🟡 Étape 3 : Charger les âges disponibles
            const resAge = await fetch("/api/ageCategories");
            const ageData = await resAge.json();
            setAgeCategories(ageData);
        }

        fetchData();
    }, [articleId]);

    // 🟡 Gérer les changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // ✅ Mettre à jour l'icône automatiquement si la catégorie change
        if (name === "category") {
            setForm({
                ...form,
                category: value,
                iconSrc: categoryIcons[value] || ""
            });
        }
        // ✅ Gestion des tags (convertir string en tableau)
        else if (name === "tags") {
            setForm({ ...form, tags: value.split(",").map(tag => tag.trim()) });
        }
        else {
            setForm({ ...form, [name]: value });
        }
    };

    // 🟡 Gérer l'upload d'image
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (res.ok) {
            setForm({ ...form, image: data.imageUrl });
            setMessage("Image uploadée !");
        } else {
            setMessage("Erreur lors de l'upload.");
        }
    };

    // ✅ Gérer la sélection des âges
    const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedAges(values);
    };

    // 🟡 Gérer l'ajout ou la modification
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Payload envoyé :", form);

        const method = articleId && articleId !== "new" ? "PUT" : "POST";
        const url = articleId && articleId !== "new" ? `/api/articles/${articleId}` : "/api/articles";

        let payload = {
            ...form,
            printableGameId: form.printableGameId || null,
            printableSupport: form.printableSupport || null,
            ageCategoryIds: selectedAges,
            sections: form.sections.map((s) => {
                const style = typeof s.style === "string" ? s.style.toLowerCase() : "";
                return {
                    title: s.title,
                    content: s.content,
                    style: ["highlight", "icon"].includes(style) ? style : "classique"
                };
            }),
            relatedArticleIds: form.relatedArticleIds || []
        };

        // 🔥 Si c'est un nouvel article, générer un slug
        if (articleId === "new") {
            payload.slug = generateSlug(form.title, crypto.randomUUID());
        }

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setMessage("✅ Article enregistré !");
            setTimeout(() => router.push("/admin"), 1000);
        } else {
            setMessage("❌ Erreur lors de l'enregistrement.");
        }
    };

    const addSection = () => {
        setForm({
            ...form,
            sections: [...form.sections, { title: "", content: "", style: "" }]
        });
    };

    const updateSection = (index: number, field: keyof Section, value: string) => {
        const updated = [...form.sections];
        updated[index][field] = value;
        setForm({ ...form, sections: updated });
    };

    const removeSection = (index: number) => {
        const updated = [...form.sections];
        updated.splice(index, 1);
        setForm({ ...form, sections: updated });
    };

    return (
        <div className="admin-form">
            <Breadcrumb
                onThemeSelect={(theme) => console.log("Thème sélectionné:", theme)}
                onSubCategorySelect={(subCategory) => console.log("Sous-catégorie sélectionnée:", subCategory)}
            />

            <h2>{articleId === "new" ? "Ajouter un Article" : "Modifier l'Article"}</h2>
            {message && <p className="admin-form__message">{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input type="text" id="title" name="title" placeholder="Titre" value={form.title} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="tags">Tags (séparés par des virgules)</label>
                    <input type="text" id="tags" name="tags" placeholder="Ex: 3-5 ans, 6-8 ans" value={form.tags?.join(", ") || ""} onChange={handleChange} />
                </div>

                {/*🧒 Sélection des âges concernés */}
                <div className="admin-form__group">
                    <label>Âges concernés :</label>
                    <div className="checkbox-group">
                        {ageCategories.map((age) => (
                            <label key={age.id} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    value={age.id}
                                    checked={selectedAges.includes(age.id)}
                                    onChange={(e) => {
                                        const newSelectedAges = e.target.checked
                                            ? [...selectedAges, age.id]
                                            : selectedAges.filter((id) => id !== age.id);
                                        setSelectedAges(newSelectedAges);
                                        setForm({ ...form, ageCategories: newSelectedAges });
                                    }}
                                />
                                {age.title}
                            </label>
                        ))}
                    </div>
                </div>


                <div className="admin-form__group">
                    <label htmlFor="content">Texte d’introduction (optionnel)</label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Saisis ici un texte d’intro libre (sera affiché dans la bannière)"
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        rows={4} // ✅ plus de hauteur que pour description
                    />
                </div>

                {/* 📌 Sélection de la catégorie */}
                <div className="admin-form__group">
                    <label htmlFor="category">Catégorie</label>
                    <select id="category" name="category" value={form.category} onChange={handleChange} required>
                        <option value="">Choisir une catégorie</option>
                        <option value="lecture">📘 Lecture</option>
                        <option value="chiffre">🔢 Chiffre</option>
                        <option value="logique">🧩 Jeux de logique</option>
                        <option value="mobilité">🚀 Jeux de mobilité</option>
                        <option value="craft">✂️ Loisirs créatifs</option>
                        <option value="histoire">📜 Histoire & Découvertes</option>
                        <option value="savoirs">🎓 Grands Savoirs</option>
                    </select>
                </div>

                {/* ✅ Affichage de l'icône associée */}
                {form.iconSrc && (
                    <div className="admin-form__group">
                        <p>Icône associée :</p>
                        <img src={form.iconSrc} alt="Icône de catégorie" width="50" height="50" />
                    </div>
                )}

                {/* 📌 Upload d'image */}
                <div className="admin-form__upload">
                    <label htmlFor="imageUpload">📸 Glissez une image ici ou cliquez</label>
                    <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
                    {form.image && <img src={form.image} alt="Aperçu" />}
                </div>

                <div className="admin-form__group">
                    <label htmlFor="description">Description (max. 150 caractères)</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Entrez une brève description..."
                        value={form.description}
                        onChange={(e) => {
                            if (e.target.value.length > 150) {
                                alert("❌ La description ne peut pas dépasser 250 caractères !");
                            } else {
                                setForm({ ...form, description: e.target.value });
                            }
                        }}
                        maxLength={250} // ✅ Empêche de taper plus de 250 caractères
                    />
                    {/* <p>{form.description || "".length} / 150 caractères</p> {/* ✅ Affiche le compteur */}
                    {/* <input type="text" id="description" name="description" placeholder="Description" value={form.description} onChange={handleChange} /> */}
                </div>

                <div className="admin-form__group">
                    <label htmlFor="sections">Sections de l’article</label>
                    {form.sections.map((section, index) => (
                        <div key={index} className="admin-form__section">
                            <input
                                type="text"
                                placeholder={`Titre de la section ${index + 1}`}
                                value={section.title}
                                onChange={(e) => updateSection(index, "title", e.target.value)}
                            />
                            <div className="admin-form__field">
                                <label htmlFor={`style-${index}`}>Style de la section</label>
                                <select
                                    id={`style-${index}`}
                                    value={section.style || ""}
                                    onChange={(e) => {
                                        const value = e.target.value.toLowerCase(); // 🔁 Normalisation
                                        console.log(`🎨 Style sélectionné pour la section ${index} :`, value);
                                        updateSection(index, "style", value);
                                    }}
                                >
                                    <option value="">Classique</option>
                                    <option value="highlight">Encadré coloré</option>
                                    <option value="icon">Avec icône</option>
                                </select>
                                <div className="admin-form__style-preview">
                                    {section.style === "highlight" && (
                                        <span className="badge badge--highlight">Ex : fond coloré</span>
                                    )}
                                    {section.style === "icon" && (
                                        <span className="badge badge--icon">Ex : avec icône</span>
                                    )}
                                </div>
                            </div>
                            {/* 🔘 Boutons de mise en forme rapide */}
                            <div className="admin-form__toolbar">
                                <button type="button" onClick={() => updateSection(index, "content", section.content + "**gras** ")}>Gras</button>
                                <button type="button" onClick={() => updateSection(index, "content", section.content + "*italique* ")}>Italique</button>
                                <button type="button" onClick={() => updateSection(index, "content", section.content + "- élément\n")}>Liste</button>
                                <button type="button" onClick={() => updateSection(index, "content", section.content + "😊 ")}>Emoji</button>
                            </div>

                            <div className="admin-form__editor-preview">
                                <textarea
                                    placeholder="Contenu de la section..."
                                    value={section.content}
                                    onChange={(e) => updateSection(index, "content", e.target.value)}
                                    className="admin-form__textarea"
                                />
                                <div className="admin-form__preview markdown-content">
                                    <ReactMarkdown>{section.content}</ReactMarkdown>
                                </div>
                            </div>
                            <button type="button" onClick={() => removeSection(index)}>🗑️ Supprimer</button>
                            <button type="button" onClick={addSection}>➕ Ajouter une section</button>
                        </div>
                    ))}
                </div>

                <div className="admin-form__group">
                    <label htmlFor="printableGameId">Jeu imprimable lié (facultatif)</label>
                    <select
                        id="printableGameId"
                        name="printableGameId"
                        value={form.printableGameId ?? ""}
                        onChange={(e) => setForm({ ...form, printableGameId: e.target.value || null })}
                    >
                        {form.printableGameId ? (
                            // on remplace "Aucun" par le titre du jeu déjà choisi
                            <option value={form.printableGameId}>
                                {printableGames.find(g => g.id === form.printableGameId)?.title}
                            </option>
                        ) : (
                            // sinon on propose "Aucun"
                            <option value="">Aucun</option>
                        )}
                        {/* Puis la liste complète */}
                        {printableGames.map(game => (
                            <option key={game.id} value={game.id}>
                                {game.title}
                            </option>
                        ))}

                    </select>
                    {form.printableGameId && (() => {
                        const jeu = printableGames.find((g) => g.id === form.printableGameId);
                        if (!jeu) return null;
                        return (
                            <p style={{ marginTop: 8, fontSize: "0.9em" }}>
                                👉{" "}
                                <a
                                    href={`/activites-a-imprimer/${jeu.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#555" }}
                                >
                                    Ouvrir la fiche « {jeu.title} »
                                </a>
                            </p>
                        );
                    })()}
                </div>


                <div className="admin-form__group">
                    <label>Articles liés :</label>
                    <ArticleSelector
                        allArticles={allArticles}
                        selectedIds={form.relatedArticleIds || []}
                        onChange={(ids) => setForm({ ...form, relatedArticleIds: ids })}
                        ageOptions={ageCategories}
                    />

                </div>

                <div className="admin-form__group">
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" value={form.date} onChange={handleChange} />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="author">Auteur</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        placeholder="Nom de l'auteur"
                        value={form.author}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="admin-form__button">{articleId === "new" ? "Ajouter" : "Mettre à jour"}</button>
            </form>
        </div>
    );
}
