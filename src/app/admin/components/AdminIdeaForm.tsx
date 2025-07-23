"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "../components/Breadcrumb";

interface AdminIdeaFormProps {
    ideaId?: string;
    slug?: string; // Optionnel : utilisé pour modifier une idée
}

interface Section {
    title: string;
    content: string;
    style?: string;
    imageUrl?: string;
    relatedColoringId?: string;
    relatedActivityId?: string;

}

interface RawSection {
    title?: string;
    content?: string;
    style?: string;
    imageUrl?: string;
    relatedColoringId?: string;
    relatedActivityId?: string;
}

interface RawRelation {
    id: string;
}

interface OptionWithImage {
    id: string;
    title: string;
    imageUrl: string;
}

export default function AdminIdeaForm({ ideaId }: AdminIdeaFormProps) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        image: "",
        theme: "",
        ageCategories: [] as string[],
        sections: [{
            title: "", content: "", style: "", imageUrl: "", relatedColoringId: "",
            relatedActivityId: ""
        }],
        relatedArticles: [] as string[],
    });
    const [message, setMessage] = useState("");
    const [ageCategories, setAgeCategories] = useState<{ id: string; title: string }[]>([]);
    const [allArticles, setAllArticles] = useState<{ id: string; title: string }[]>([]);
    const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
    const [allColorings, setAllColorings] = useState<OptionWithImage[]>([]);
    const [allActivities, setAllActivities] = useState<OptionWithImage[]>([]);
    const [selectedSectionColorings, setSelectedSectionColorings] = useState<string[]>([]);
    const [selectedSectionActivities, setSelectedSectionActivities] = useState<string[]>([]);

    const router = useRouter();

    // Charger les données de l'idée si un `ideaId` est passé
    useEffect(() => {
        if (ideaId && ideaId !== "new") {
            fetch(`/api/ideas/${ideaId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("📝 Idée récupérée :", data);
                    const cleanSections = (data.sections || []).map((section: RawSection) => ({
                        title: section.title || "",
                        content: section.content || "",
                        style: section.style || "",
                        imageUrl: section.imageUrl || "",
                        relatedColoringId: section.relatedColoringId || "",
                        relatedActivityId: section.relatedActivityId || "",
                    }));

                    setForm({
                        ...data,
                        ageCategories: Array.isArray(data.ageCategories) ? data.ageCategories : [],
                        sections: cleanSections.length > 0 ? cleanSections : [{
                            title: "", content: "", style: "", imageUrl: "", relatedColoringId: "", relatedActivityId: ""
                        }],
                        relatedArticles: data.relatedArticles.map((relation: RawRelation) => relation.id) || [],
                    });

                    setSelectedArticles(data.relatedArticles.map((relation: RawRelation) => relation.id));

                    // 🔥 AJOUTER CETTE PARTIE POUR INITIALISER LES ÉTATS DES SECTIONS
                    const coloringIds = cleanSections.map((section: RawSection) => section.relatedColoringId || "");
                    const activityIds = cleanSections.map((section: RawSection) => section.relatedActivityId || "");
                    setSelectedSectionColorings(coloringIds);
                    setSelectedSectionActivities(activityIds);
                })
                .catch(() => setMessage("❌ Erreur lors du chargement de l'idée."));
        } else {
            // 🔥 POUR UNE NOUVELLE IDÉE, INITIALISER AVEC UNE SECTION VIDE
            setSelectedSectionColorings([""]);
            setSelectedSectionActivities([""]);
        }

        // Charger toutes les catégories d'âge disponibles
        fetch("/api/ageCategories")
            .then(res => res.json())
            .then(data => {
                console.log("📥 Catégories d'âge reçues :", data);
                setAgeCategories(data);
            });

        // Charger tous les articles disponibles
        fetch("/api/articles")
            .then(res => res.json())
            .then(data => {
                console.log("📥 Articles reçus :", data);
                setAllArticles(data);
            });

        // Coloriages
        fetch("/api/drawings")
            .then(res => res.json())
            .then(data => {
                console.log("🎨 Coloriages reçus :", data);
                setAllColorings(data);
            });

        // Activités
        fetch("/api/printable-games")
            .then(res => res.json())
            .then(data => {
                console.log("🧩 Activités reçues :", data);
                setAllActivities(data);
            });


    }, [ideaId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // ✅ Gérer la sélection des catégories d'âge
    const handleAgeCategoryChange = (id: string) => {
        setForm((prev) => {
            const alreadySelected = prev.ageCategories.includes(id);
            return {
                ...prev,
                ageCategories: alreadySelected
                    ? prev.ageCategories.filter((ageId) => ageId !== id) // Décocher
                    : [...prev.ageCategories, id], // Cocher
            };
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();

            if (res.ok) {
                setForm((prev) => ({ ...prev, image: data.imageUrl }));
                setMessage("✅ Image uploadée !");
            } else {
                setMessage("❌ Erreur lors de l'upload.");
            }
        } catch {
            setMessage("❌ Erreur de connexion lors de l'upload.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = ideaId ? "PUT" : "POST";
        const url = ideaId ? `/api/ideas/${ideaId}` : "/api/ideas";

        console.log("🔎 Envoi de l'idée :", {
            ...form,
            ageCategoryIds: form.ageCategories,
            relatedArticleIds: selectedArticles,
        });

        // 🔥 AJOUTER CE LOG POUR VÉRIFIER LES SECTIONS
        console.log("📋 Sections détaillées :", form.sections);
        console.log("🎨 Coloriages sélectionnés :", selectedSectionColorings);
        console.log("🧩 Activités sélectionnées :", selectedSectionActivities);

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    ageCategoryIds: form.ageCategories,
                    relatedArticleIds: selectedArticles,
                    sections: form.sections.map((section: Section) => ({
                        title: section.title,
                        content: section.content,
                        style: section.style,
                        imageUrl: section.imageUrl,
                        relatedColoringId: section.relatedColoringId || null,
                        relatedActivityId: section.relatedActivityId || null,
                    }))

                }),
            });

            if (res.ok) {
                setMessage(`✅ Idée ${ideaId ? "mise à jour" : "ajoutée"} avec succès !`);
                setTimeout(() => router.push("/admin?section=ideas"), 1000);
            } else {
                const errorData = await res.json();
                console.error("❌ Erreur serveur :", errorData);
                setMessage("❌ Erreur lors de l'enregistrement de l'idée.");
            }
        } catch (error) {
            console.error("❌ Erreur de connexion :", error);
            setMessage("❌ Erreur de connexion avec le serveur.");
        }
    };

    // ✅ Gestion des sections
    const addSection = () => {
        setForm((prev) => ({
            ...prev,
            sections: [...prev.sections, {
                title: "", content: "", style: "", imageUrl: "", relatedColoringId: "",
                relatedActivityId: "",
            }],
        }));

        // 🔥 AJOUTER CETTE PARTIE
        setSelectedSectionColorings(prev => [...prev, ""]);
        setSelectedSectionActivities(prev => [...prev, ""]);
    };
    useEffect(() => {
        fetch("/api/articles")
            .then(res => res.json())
            .then(data => {
                setAllArticles(data);
            });
    }, []);

    // ✅ Gérer le changement de sélection
    const handleRelatedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        console.log("📝 Articles sélectionnés :", selectedOptions);

        // ✅ Mettre à jour les articles sélectionnés dans le state
        setSelectedArticles(selectedOptions);

        // ✅ Synchroniser avec le formulaire
        setForm(prev => ({
            ...prev,
            relatedArticles: selectedOptions,
        }));
    };


    const updateSection = (index: number, field: keyof Section, value: string) => {
        const updatedSections = [...form.sections];
        updatedSections[index][field] = value;
        setForm({ ...form, sections: updatedSections });

        // 🔥 AJOUTER CETTE PARTIE POUR SYNCHRONISER LES STATES
        if (field === 'relatedColoringId') {
            const newSelectedColorings = [...selectedSectionColorings];
            newSelectedColorings[index] = value;
            setSelectedSectionColorings(newSelectedColorings);
        }

        if (field === 'relatedActivityId') {
            const newSelectedActivities = [...selectedSectionActivities];
            newSelectedActivities[index] = value;
            setSelectedSectionActivities(newSelectedActivities);
        }
    };

    const removeSection = (index: number) => {
        const updatedSections = [...form.sections];
        updatedSections.splice(index, 1);
        setForm({ ...form, sections: updatedSections });

        // 🔥 METTRE À JOUR LES ÉTATS DES COLORIAGES ET ACTIVITÉS
        const updatedColorings = [...selectedSectionColorings];
        updatedColorings.splice(index, 1);
        setSelectedSectionColorings(updatedColorings);

        const updatedActivities = [...selectedSectionActivities];
        updatedActivities.splice(index, 1);
        setSelectedSectionActivities(updatedActivities);
    };

    // 🔧 AUSSI, AJOUTEZ CETTE FONCTION DE DÉBOGAGE TEMPORAIRE
    const debugSectionData = () => {
        console.log("🔍 DEBUG - État actuel :");
        console.log("Form sections:", form.sections);
        console.log("Selected colorings:", selectedSectionColorings);
        console.log("Selected activities:", selectedSectionActivities);

        form.sections.forEach((section, index) => {
            console.log(`Section ${index}:`, {
                title: section.title,
                relatedColoringId: section.relatedColoringId,
                relatedActivityId: section.relatedActivityId,
            });
        });
    };

    return (
        <div className="admin-form">
            <Breadcrumb
                onThemeSelect={(theme) => console.log("Thème sélectionné:", theme)}
                onSubCategorySelect={(subCategory) => console.log("Sous-catégorie sélectionnée:", subCategory)}
            />

            <h2>{ideaId ? "Modifier l'Idée" : "Ajouter une Nouvelle Idée"} 💡</h2>
            {message && <p className="admin-form__message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Titre de l'idée"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="admin-form__group">
                    <label htmlFor="description">Description (max. 150 caractères)</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Entrez une brève description..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value.slice(0, 150) })}
                        maxLength={150}
                    />
                    <p>{form.description.length} / 150 caractères</p>
                </div>

                {/* ✅ Sélection des catégories d'âge */}
                <div className="admin-form__group">
                    <label>📌 Âges concernés :</label>
                    <div className="checkbox-group">
                        {ageCategories.map((age) => (
                            <label key={age.id} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={form.ageCategories.includes(age.id)}
                                    onChange={() => handleAgeCategoryChange(age.id)}
                                />
                                {age.title}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="admin-form">
                    <div className="admin-form__group">
                        <label>Articles liés :</label>
                        <select
                            multiple
                            value={selectedArticles} // 🔄 Utilise le state pour la sélection multiple
                            onChange={handleRelatedChange}
                        >
                            {allArticles.map(article => (
                                <option
                                    key={article.id}
                                    value={article.id}
                                >
                                    {article.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>


                <div className="admin-form__upload">
                    <label htmlFor="imageUpload">📸 Image</label>
                    <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
                    {form.image && <img src={form.image} alt="Aperçu" className="admin-form__image-preview" />}
                </div>
                <div className="admin-form__group">
                    <label htmlFor="theme">Thème</label>
                    <select id="theme" name="theme" value={form.theme} onChange={handleChange} required>
                        <option value="">Sélectionnez un thème</option>
                        <option value="winter">❄️ Hiver</option>
                        <option value="summer">🌞 Été</option>
                        <option value="spring">🌸 Printemps</option>
                        <option value="autumn">🍂 Automne</option>
                        <option value="christmas">🎄 Noël</option>
                        <option value="easter">🐣 Pâques</option>
                        <option value="Toussaint">🕯️ Toussaint</option>
                        <option value="Epiphanie">👑 Épiphanie</option>
                        <option value="Chandeleur">🕯️ Chandeleur</option>
                        <option value="Saint-Jean">🔥 Saint Jean</option>
                    </select>
                </div>

                {/* ✅ Gestion des sections */}
                <div className="admin-form__group">
                    <label>Sections</label>
                    {form.sections.map((section, index) => (
                        <div key={index} className="admin-form__section">

                            {/* 🔹 Titre de la section */}
                            <input
                                placeholder="Titre de section"
                                value={section.title}
                                onChange={e => updateSection(index, "title", e.target.value)}
                            />

                            {/* 🔹 Contenu de la section */}
                            <textarea
                                placeholder="Contenu"
                                value={section.content}
                                onChange={e => updateSection(index, "content", e.target.value)}
                            />

                            {/* 🔹 Gestion de l'upload de l'image */}
                            <div className="admin-form__section-upload">
                                <label htmlFor={`imageUpload-${index}`}>📸 Ajouter une image pour cette section</label>
                                <input
                                    id={`imageUpload-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const formData = new FormData();
                                        formData.append("file", file);

                                        const res = await fetch("/api/upload", { method: "POST", body: formData });
                                        const data = await res.json();

                                        if (res.ok) {
                                            const updated = [...form.sections];
                                            updated[index].imageUrl = data.imageUrl;
                                            setForm({ ...form, sections: updated });
                                        } else {
                                            alert("❌ Erreur lors de l'upload d'image pour la section.");
                                        }
                                    }}
                                />

                                {/* 🔹 Affichage de l'aperçu de l'image */}
                                {form.sections[index].imageUrl && (
                                    <div className="admin-form__section-upload-preview">
                                        <img src={form.sections[index].imageUrl} alt="Aperçu" />
                                    </div>
                                )}
                            </div>

                            {/* 🔹 Sélecteur de style */}
                            <select
                                value={section.style || ""}
                                onChange={e => updateSection(index, "style", e.target.value)}
                            >
                                <option value="">Classique</option>
                                <option value="highlight">Fond coloré</option>
                                <option value="icon">Avec icône</option>
                            </select>

                            {/* 🔹 Sélectionner un coloriage lié */}
                            <div className="admin-form__group">
                                <label>🎨 Coloriage à lier à cette section :</label>
                                <select
                                    id={`section-${index}-coloring`}
                                    value={section.relatedColoringId || ""}
                                    onChange={e => updateSection(index, "relatedColoringId", e.target.value)}
                                >
                                    <option value="">— Aucun —</option>
                                    {allColorings
                                        .sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }))
                                        .map(coloring => (
                                            <option key={coloring.id} value={coloring.id}>
                                                {coloring.title}
                                            </option>
                                        ))
                                    }
                                </select>

                                {/* Affiche le titre (et une miniature si dispo) du coloriage sélectionné */}
                                {section.relatedColoringId && (() => {
                                    const sel = allColorings.find(c => c.id === section.relatedColoringId);
                                    if (!sel) return null;
                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                                            {sel.imageUrl && (
                                                <img
                                                    src={sel.imageUrl}
                                                    alt={sel.title}
                                                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginRight: 8 }}
                                                />
                                            )}
                                            <span>{sel.title}</span>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* 🔹 Sélectionner une activité liée */}
                            <div className="admin-form__group">
                                <label>🧩 Activité à lier à cette section :</label>
                                <select
                                    value={section.relatedActivityId || ""}
                                    onChange={e => updateSection(index, "relatedActivityId", e.target.value)}
                                >
                                    <option value="">— Aucune —</option>
                                    {allActivities.map(activity => (
                                        <option key={activity.id} value={activity.id}>
                                            {activity.title}
                                        </option>
                                    ))}
                                </select>

                                {/* Affiche le titre (et une miniature si dispo) de l’activité sélectionnée */}
                                {section.relatedActivityId && (() => {
                                    const sel = allActivities.find(a => a.id === section.relatedActivityId);
                                    if (!sel) return null;
                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                                            {sel.imageUrl && (
                                                <img
                                                    src={sel.imageUrl}
                                                    alt={sel.title}
                                                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginRight: 8 }}
                                                />
                                            )}
                                            <span>{sel.title}</span>
                                        </div>
                                    );
                                })()}
                            </div>


                            {/* 🔹 Bouton de suppression */}
                            <button type="button" onClick={() => removeSection(index)}>🗑️ Supprimer</button>
                        </div>
                    ))}

                    {/* 🔹 Ajouter une nouvelle section */}
                    <button type="button" onClick={addSection}>➕ Ajouter une section</button>
                </div>


                <button type="submit" className="admin-form__button">
                    {ideaId ? "Mettre à jour" : "Ajouter"}
                </button>
            </form>
        </div>
    );
}