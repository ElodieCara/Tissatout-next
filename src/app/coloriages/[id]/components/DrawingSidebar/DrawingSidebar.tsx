import Image from "next/image";
import Link from "next/link";
import { getSimilarDrawings } from "@/lib/server";

interface DrawingSidebarProps {
    category: string;
    currentDrawingId: string;
}

export default async function DrawingSidebar({ category, currentDrawingId }: DrawingSidebarProps) {
    const similarDrawings = await getSimilarDrawings(category, currentDrawingId, 4); // ✅ Limite à 4

    if (similarDrawings.length === 0) return null; // Si aucun autre dessin, ne pas afficher

    return (
        <aside className="drawing-sidebar">
            <h3 className="drawing-sidebar__title">📜 Autres coloriages dans {category}</h3>
            <ul className="drawing-sidebar__list">
                {similarDrawings.map((drawing) => (
                    <li key={drawing.id} className="drawing-sidebar__item">
                        <Link href={`/coloriages/${drawing.id}`}>
                            <div className="drawing-sidebar__card">
                                <Image
                                    src={drawing.imageUrl}
                                    alt={drawing.title}
                                    width={50}
                                    height={50}
                                    className="drawing-sidebar__image"
                                    loading="lazy"
                                />
                                <span className="drawing-sidebar__title">{drawing.title}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
