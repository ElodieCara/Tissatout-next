import { Schema, model, models } from "mongoose";
import slugify from "slugify"; // Installez slugify si besoin : npm install slugify

const ArticleSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        image: { type: String },
        tags: { type: [String], default: [] },
        date: { type: Date, default: Date.now },
        slug: { type: String, unique: true }, // Ajout du slug
    },
    { timestamps: true }
);

// Middleware pour générer le slug avant l'enregistrement
ArticleSchema.pre("save", function (next) {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

const Article = models.Article || model("Article", ArticleSchema);

export default Article;
