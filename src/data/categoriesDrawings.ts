import { ObjectId } from "mongodb";

export const categoriesDrawings = {
    "Saisons et Fêtes": [
        { id: new ObjectId().toString(), name: "Hiver ❄️" },
        { id: new ObjectId().toString(), name: "Printemps 🌸" },
        { id: new ObjectId().toString(), name: "Été 🌞" },
        { id: new ObjectId().toString(), name: "Automne 🍂" },
        { id: new ObjectId().toString(), name: "Noël 🎄" },
        { id: new ObjectId().toString(), name: "Halloween 🎃" },
        { id: new ObjectId().toString(), name: "Pâques 🐣" },
        { id: new ObjectId().toString(), name: "Fête des Mères 💐" },
        { id: new ObjectId().toString(), name: "Fête des Pères 👨‍👧" },
        { id: new ObjectId().toString(), name: "Saint-Valentin ❤️" },
        { id: new ObjectId().toString(), name: "Rentrée Scolaire 🎒" },
        { id: new ObjectId().toString(), name: "Nouvel An 🎆" }
    ],
    "Thèmes": [
        { id: new ObjectId().toString(), name: "Animaux 🐾" },
        { id: new ObjectId().toString(), name: "Véhicules 🚗" },
        { id: new ObjectId().toString(), name: "Mandalas 🌀" },
        { id: new ObjectId().toString(), name: "Nature 🌿" },
        { id: new ObjectId().toString(), name: "Espace 🚀" },
        { id: new ObjectId().toString(), name: "Contes de fées 🏰" },
        { id: new ObjectId().toString(), name: "Pirates 🏴‍☠️" },
        { id: new ObjectId().toString(), name: "Sirènes 🧜‍♀️" },
        { id: new ObjectId().toString(), name: "Super-héros 🦸‍♂️" },
        { id: new ObjectId().toString(), name: "Dinosaures 🦖" },
        { id: new ObjectId().toString(), name: "Magie & Sorcellerie 🔮" },
        { id: new ObjectId().toString(), name: "Métiers & Professions 👨‍⚕️" },
        { id: new ObjectId().toString(), name: "Sports ⚽" },
        { id: new ObjectId().toString(), name: "Robots 🤖" },
        { id: new ObjectId().toString(), name: "Jeux Vidéo 🎮" },
        { id: new ObjectId().toString(), name: "Cinéma & Dessins Animés 🎬" }
    ],
    "Âge": [
        { id: new ObjectId().toString(), name: "Tout Petits (0-3 ans) 👶" },
        { id: new ObjectId().toString(), name: "Dès 3 ans 🧒" },
        { id: new ObjectId().toString(), name: "Dès 6 ans 🧑" },
        { id: new ObjectId().toString(), name: "Dès 10 ans 👦" }
    ],
    "Éducatif & Trivium": [
        { id: new ObjectId().toString(), name: "Grammaire (Lettres & Mots) 📖" },
        { id: new ObjectId().toString(), name: "Mathématiques & Chiffres 🔢" },
        { id: new ObjectId().toString(), name: "Logique & Jeux de réflexion 🧩" },
        { id: new ObjectId().toString(), name: "Histoire & Civilisations 🏛️" },
        { id: new ObjectId().toString(), name: "Sciences & Découvertes 🔬" },
        { id: new ObjectId().toString(), name: "Philosophie & Mythologie 📜" },
        { id: new ObjectId().toString(), name: "Arts & Créativité 🎨" },
        { id: new ObjectId().toString(), name: "Langues & Culture 🗣️" }
    ]
} as const;
