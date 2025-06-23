"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Comment {
    id: string;
    content: string;
    approved: boolean;
    createdAt: string;
    resourceLabel: string;
    resourceSlug: string;
    resourceType: string;
}

function getUrlPrefix(type: string): string {
    switch (type) {
        case "Article": return "articles";
        case "Conseil": return "conseils";
        case "Idée": return "idees";
        case "Activité à imprimer": return "activites-a-imprimer";
        default: return "";
    }
}


export default function AdminCommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/comments/moderation")
            .then((res) => res.json())
            .then((data) => {
                setComments(data);
                setLoading(false);
            });
    }, []);

    const updateCommentStatus = async (id: string, approve: boolean) => {
        await fetch(`/api/comments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ approved: approve }),
        });
        setComments((prev) =>
            prev.map((c) => (c.id === id ? { ...c, approved: approve } : c))
        );
    };

    const deleteComment = async (id: string) => {
        await fetch(`/api/comments/${id}`, {
            method: "DELETE",
        });
        setComments((prev) => prev.filter((c) => c.id !== id));
    };

    if (loading) return <p>Chargement des commentaires...</p>;

    return (
        <div className="admin__comments">
            <h2 className="admin__comments-title">💬 Commentaires à modérer</h2>
            <ul className="admin__comments__list">
                {comments.map((comment) => (
                    <li key={comment.id} className="admin__comments__list-item">
                        <div className="admin__comments__list-item-meta">
                            <strong>{comment.resourceType}</strong> —
                            <a href={`/${getUrlPrefix(comment.resourceType)}/${comment.resourceSlug}`} target="_blank">
                                {comment.resourceLabel}
                            </a> —{" "}
                            {new Date(comment.createdAt).toLocaleString("fr-FR")}
                        </div>
                        <div className="admin__comments__list-item-content">
                            {comment.content}
                        </div>
                        <div className="admin__comments__list-item-actions">
                            {!comment.approved && (
                                <button className="approve" onClick={() => updateCommentStatus(comment.id, true)}>✅ Approuver</button>
                            )}
                            {comment.approved && (
                                <button className="revoke" onClick={() => updateCommentStatus(comment.id, false)}>⛔ Révoquer</button>
                            )}
                            <button className="delete" onClick={() => deleteComment(comment.id)}>🗑️ Supprimer</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
