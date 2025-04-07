"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Comment {
    id: string;
    content: string;
    articleTitle: string;
    articleSlug: string;
    approved: boolean;
    createdAt: string;
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
        <div className="admin-comments">
            <h2>Commentaires à modérer</h2>
            {comments.length === 0 ? (
                <p>Aucun commentaire pour le moment.</p>
            ) : (
                <ul className="admin-comments__list">
                    {comments.map((comment) => (
                        <li key={comment.id} className="admin-comments__item">
                            <p className="admin-comments__meta">
                                <Link href={`/articles/${comment.articleSlug}`}>
                                    {comment.articleTitle}
                                </Link>{" "}
                                — {new Date(comment.createdAt).toLocaleString("fr-FR")}
                            </p>
                            <p className="admin-comments__content">{comment.content}</p>
                            <div className="admin-comments__actions">
                                {!comment.approved && (
                                    <button onClick={() => updateCommentStatus(comment.id, true)}>
                                        ✅ Approuver
                                    </button>
                                )}
                                {comment.approved && (
                                    <button onClick={() => updateCommentStatus(comment.id, false)}>
                                        ⛔ Révoquer
                                    </button>
                                )}
                                <button onClick={() => deleteComment(comment.id)}>🗑️ Supprimer</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
