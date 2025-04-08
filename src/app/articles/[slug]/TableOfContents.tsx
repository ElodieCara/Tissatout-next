import Link from "next/link";
import { slugify } from "@/lib/slugify";

interface Props {
    sections: { title: string }[];
}

export default function TableOfContents({ sections }: Props) {
    if (!sections || sections.length === 0) return null;

    return (
        <nav className="toc">
            <h3 className="toc__title">📚 Sommaire</h3>
            <ul className="toc__list">
                {sections.map((section) => (
                    <li key={section.title} className="toc__item">
                        <Link href={`#${slugify(section.title)}`} className="toc__link">
                            {section.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
