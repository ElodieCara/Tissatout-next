import Image from "next/image";
import Link from "next/link";
import { getSimilarDrawings } from "@/lib/server";

interface DrawingSidebarProps {
    category: string;
    currentDrawingId: string;
}

export default async function DrawingSidebar({ category, currentDrawingId }: DrawingSidebarProps) {
    const similarDrawings = await getSimilarDrawings(category, currentDrawingId, 4);

    if (similarDrawings.length === 0) return null;

    return (
        <aside className="drawing-sidebar">
            <h3 className="drawing-sidebar__title">Autres coloriages dans {category}</h3>
            <ul className="drawing-sidebar__list">
                {similarDrawings.map((drawing) => (
                    <li key={drawing.id} className="drawing-sidebar__item">
                        <Link href={`/coloriages/${drawing.slug}`} className="drawing-sidebar__link">
                            <div className="drawing-sidebar__card">
                                <div className="drawing-sidebar__image-wrapper">
                                    <Image
                                        src={drawing.imageUrl}
                                        alt={drawing.title}
                                        width={100}
                                        height={100}
                                        className="drawing-sidebar__image"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="drawing-sidebar__content">
                                    <h4 className="drawing-sidebar__title">{drawing.title}</h4>
                                    <button className="drawing-sidebar__button">Voir le coloriage</button>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
