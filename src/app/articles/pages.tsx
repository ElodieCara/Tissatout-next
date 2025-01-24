import { notFound } from "next/navigation";
import { news, ideas } from "@/data/home";
import Image, { StaticImageData } from "next/image";

interface Article {
    id: number;
    title: string;
    description: string;
    image: string | StaticImageData;
    date?: string;
}

export default function ArticlePage({ params }: { params: { id: string } }) {
    const articleId = Number(params.id);
    const articles: Article[] = [...news, ...ideas];
    const article = articles.find((a) => a.id === articleId);

    if (!article) {
        notFound();
    }

    return (
        <main>
            <h1>{article?.title} </h1>
            < p > {article?.description} </p>
            < Image
                src={article?.image}
                alt={article?.title || "Image de l'article"
                }
                width={800}
                height={400}
            />
            <p>Date : {article?.date} </p>
        </main>
    );
}
