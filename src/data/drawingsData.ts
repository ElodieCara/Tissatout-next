import { ObjectId } from "mongodb";

export const drawingsData = [
    {
        id: new ObjectId().toString(), // ✅ ID valide pour MongoDB
        title: "Coloriage de Noël",
        imageUrl: "/uploads/noel1.png",
        categoryId: "657c3f2c6c8b0a00123abcd4", // Remplace par un vrai ID de catégorie dans ta base
    },
    {
        id: new ObjectId().toString(),
        title: "Dessin de printemps",
        imageUrl: "/uploads/printemps1.png",
        categoryId: "657c3f2c6c8b0a00123abcd5",
    },
    {
        id: new ObjectId().toString(),
        title: "Mandalas apaisants",
        imageUrl: "/uploads/mandala1.png",
        categoryId: "657c3f2c6c8b0a00123abcd6",
    }
];
