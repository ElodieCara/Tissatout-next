"use client";

import { useEffect, useState } from "react";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author?: string;
}

export default function CommentList({
    resourceType,
    resourceId
}: {
    resourceType: "article" | "advice" | "idea" | "printable" | "printable-drawing" | "drawing" | "lesson";
    resourceId: string;
}) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!resourceType || !resourceId) {
            console.warn(
                "⏳ CommentList : props manquantes → type ou id vide, skip fetch."
            );
            setLoading(false);
            setComments([]);
            return;
        }
        const fetchComments = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/comments?type=${resourceType}&id=${resourceId}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erreur lors du chargement des commentaires');
                }

                const data = await response.json();
                setComments(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Erreur lors du chargement des commentaires:', err);
                setError(err instanceof Error ? err.message : 'Erreur inconnue');
                setComments([]);
            } finally {
                setLoading(false);
            }
        };

        if (resourceType && resourceId) {
            fetchComments();
        }
    }, [resourceType, resourceId]);

    if (loading) return <div>Chargement des commentaires...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div className="article__comments">
            <h3 className="article__comments-title">🗣️ Les avis des lecteurs</h3>
            <ul className="article__comments-list">
                {comments.map((comment) => (
                    <li key={comment.id} className="article__comments-item">
                        <div className="article__comments-header">
                            <div className="article__comments-avatar">👤</div>
                            <div>
                                <p className="article__comments-author">
                                    {comment.author?.trim() || "Un Tissatoupeur"}
                                </p>
                                <time className="article__comments-date">
                                    {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </time>
                            </div>
                        </div>
                        <p className="article__comments-content">{comment.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
