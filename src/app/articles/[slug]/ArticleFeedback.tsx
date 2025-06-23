// "use client";
// import { useState } from "react";

// export default function ArticleFeedback({ articleId }: { articleId: string }) {
//     const [content, setContent] = useState("");
//     const [author, setAuthor] = useState("");
//     const [message, setMessage] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);

//         const res = await fetch("/api/comments", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ articleId, content, author }),
//         });

//         setLoading(false);

//         if (res.ok) {
//             setContent("");
//             setAuthor("");
//             setMessage("✅ Merci pour ton avis ! Il sera visible après validation.");
//         } else {
//             setMessage("❌ Une erreur est survenue.");
//         }
//     };

//     return (
//         <div className="article__feedback">
//             <h2 className="article__feedback-title">💬 Et toi, qu'en as-tu pensé ?</h2>
//             <form className="article__feedback-form" onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     placeholder="Ton prénom (facultatif)"
//                     className="article__feedback-input"
//                     value={author}
//                     onChange={(e) => setAuthor(e.target.value)}
//                 />

//                 <textarea
//                     placeholder="Ton avis, ton expérience, un mot gentil..."
//                     className="article__feedback-textarea"
//                     rows={4}
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     required
//                 />

//                 <button type="submit" disabled={loading} className="article__feedback-submit">
//                     {loading ? "Envoi..." : "Envoyer 💌"}
//                 </button>
//                 {message && <p className="article__feedback-message">{message}</p>}
//             </form>
//         </div>
//     );
// }
