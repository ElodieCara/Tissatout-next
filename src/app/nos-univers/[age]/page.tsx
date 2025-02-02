import { sections } from "@/data/home";
import { notFound } from "next/navigation";

export default function AgePage({ params }: { params: { age: string } }) {
    const section = sections.find((s) => encodeURIComponent(s.title) === params.age);

    if (!section) return notFound(); // 404 si la tranche d'âge n'existe pas

    return (
        <div>
            <h1>{section.content}</h1>
            <p>{section.description}</p>

            <ul>
                {section.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                ))}
            </ul>

            <p>{section.conclusion}</p>
        </div>
    );
}
