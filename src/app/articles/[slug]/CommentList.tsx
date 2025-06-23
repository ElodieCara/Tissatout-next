// "use client";

// import { useEffect, useState } from "react";

// interface Comment {
//     id: string;
//     content: string;
//     createdAt: string;
//     author?: string; // ✅ Ajout de l'auteur
// }

// export default function CommentList({
//     resourceType,
//     resourceId,
// }: {
//     resourceType: "article" | "advice" | "idea" | "printable"; // tu peux préciser les 4
//     resourceId: string;
// }) {
//     const [comments, setComments] = useState<Comment[]>([]);

//     useEffect(() => {
//         fetch(`/api/comments?type=${resourceType}&id=${resourceId}`)
//             .then((res) => res.json())
//             .then(setComments);
//     }, [resourceType, resourceId]);

//     if (comments.length === 0) return null;

//     return (
//         <div className="article__comments">
//             <h3 className="article__comments-title">🗣️ Les avis des lecteurs</h3>
//             <ul className="article__comments-list">
//                 {comments.map((comment) => (
//                     <li key={comment.id} className="article__comments-item">
//                         <div className="article__comments-header">
//                             <div className="article__comments-avatar">👤</div>
//                             <div>
//                                 <p className="article__comments-author">
//                                     {comment.author?.trim() || "Un Tissatoupeur"}
//                                 </p>
//                                 <time className="article__comments-date">
//                                     {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
//                                         day: "2-digit",
//                                         month: "long",
//                                         year: "numeric",
//                                     })}
//                                 </time>
//                             </div>
//                         </div>
//                         <p className="article__comments-content">{comment.content}</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
