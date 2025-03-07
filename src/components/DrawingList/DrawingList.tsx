import DrawingCard from "../DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";

export default function DrawingList({ title, drawings }: { title: string; drawings: Drawing[] }) {
    return (
        <div className="drawing-list">
            <h3>{title}</h3>
            <div className="drawing-grid">
                {drawings.length > 0 ? (
                    drawings.map((drawing) => (
                        <DrawingCard key={drawing.id} id={drawing.id} imageUrl={drawing.imageUrl} theme={drawing.title} views={drawing.views ?? 0} likes={drawing.likes ?? 0} />
                    ))
                ) : (
                    <p>⏳ Aucun coloriage disponible...</p>
                )}
            </div>
        </div>
    );
}
