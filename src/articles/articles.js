import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        const articles = await Article.find({});
        return res.status(200).json(articles);
    }

    if (req.method === "POST") {
        const { title, content, slug, tags } = req.body;
        const newArticle = new Article({ title, content, slug, tags });
        await newArticle.save();
        return res.status(201).json(newArticle);
    }

    return res.status(405).json({ message: "Méthode non autorisée" });
}
