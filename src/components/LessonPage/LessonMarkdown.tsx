import Markdown from "react-markdown";

export default function LessonMarkdown({ content }: { content: string }) {
    return (
        <section className="lesson__content">
            <Markdown>{content}</Markdown>
        </section>
    );
}
