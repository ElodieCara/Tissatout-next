import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminCommentsPage() {
    const comments = await prisma.comment.findMany({
        where: { approved: false },
        orderBy: { createdAt: "desc" },
        include: {
            article: {
                select: { id: true, title: true, slug: true }
            }
        }
    });

    return (
        <main className="admin-comments">
            <h1>💬 Commentaires à modérer</h1>

            {comments.length === 0 ? (
                <p>Aucun commentaire en attente.</p>
            ) : (
                <ul className="admin-comments__list">
                    {comments.map((c) => (
                        <li key={c.id} className="admin-comments__item">
                            <p className="admin-comments__content">{c.content}</p>
                            <p className="admin-comments__meta">
                                Sur : <Link href={`/articles/${c.article.slug}`}>{c.article.title}</Link> – {new Date(c.createdAt).toLocaleString()}
                            </p>
                            <div className="admin-comments__actions">
                                <form method="POST" action={`/api/comments/${c.id}?action=approve`}>
                                    <button type="submit">✅ Valider</button>
                                </form>
                                <form method="POST" action={`/api/comments/${c.id}?action=delete`}>
                                    <button type="submit">🗑️ Supprimer</button>
                                </form>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
