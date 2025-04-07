// components/CommentList.tsx
"use client";

import { useEffect, useState } from "react";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
}

export default function CommentList({ articleId }: { articleId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        async function fetchComments() {
            const res = await fetch(`/api/comments?articleId=${articleId}`);
            const data = await res.json();
            setComments(data);
        }
        fetchComments();
    }, [articleId]);

    if (comments.length === 0) return null;

    return (
        <div className="article__comments">
            <h3 className="article__comments-title">🗣️ Les avis des lecteurs</h3>
            <ul className="article__comments-list">
                {comments.map((comment) => (
                    <li key={comment.id} className="article__comment">
                        <p className="article__comment-content">{comment.content}</p>
                        <time className="article__comment-date">
                            {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                        </time>
                    </li>
                ))}
            </ul>
        </div>
    );
}
