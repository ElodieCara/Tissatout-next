import ReactMarkdown from "react-markdown";
import Image from "next/image";


interface LessonBlockProps {
    type: "info" | "revision" | "homework";
    title: string;
    content?: string | null;
}

const icons = {
    info: "/icons/titres/livre.png",
    revision: "/icons/titres/calendrier.png",
    homework: "/icons/titres/cible.png",
};

export default function LessonBlock({ type, title, content }: LessonBlockProps) {
    if (!content?.trim()) return null;

    return (
        <section className={`lesson-block lesson-block--${type}`}>
            <div className="lesson-block__header">
                <Image
                    src={icons[type]}
                    alt=""
                    width={58}
                    height={52}
                    className="lesson-block__icon"
                />
                <h3 className="lesson-block__title">{title}</h3>
            </div>
            <div className="lesson-block__content">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </section>
    );
}
