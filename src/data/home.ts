import Slide1 from "@/assets/slide1.jpg";
import Slide2 from "@/assets/slide2.png";
import Slide3 from "@/assets/slide3.png";
import Btntp from "@/assets/tpbtn.png";
import BtnD3 from "@/assets/d3btn.png";
import BtnD6 from "@/assets/d6btn.png";
import BtnD8 from "@/assets/d8btn.png";
import Tp from "@/assets/tp.png";
import D3 from "@/assets/D3.png";
import D6 from "@/assets/D6.png";
import D8 from "@/assets/D8.png";
import N1 from "@/assets/news/news1.webp";
import N2 from "@/assets/news/news2.jpg";
import N3 from "@/assets/news/news3.jpg";
import ABC from "@/assets/news/abecedaire.png";
import Blocs from "@/assets/news/blocs-de-jouets.png";
import Chariot from "@/assets/news/chariot.png";
import Toys from "@/assets/news/toys.png";

import { Slide, Section, News, Idea, Activity } from "@/types/home"; // Types définis


export type ActivityCategory = "trivium" | "quadrivium";

export const slide: Slide[] = [
    { id: 1, image: Slide1 },
    { id: 2, image: Slide2 },
    { id: 3, image: Slide3 },
];

export const sections: Section[] = [
    {
        title: "Tout-petits",
        color: "#ECAC3E",
        buttonImage: Tp,
        imageCard: Tp,
        slug: "tout-petits",
        content: "Tout-petits : éveil et magie des premiers moments 🎨✨",
        description: "Plongez avec votre enfant dans un univers d’éveil tout en douceur. 🌟 Découvrez des activités pensées pour stimuler sa curiosité et développer ses sens :",
        activities: [
            "🖍️ Coloriages simples pour ses premières œuvres d’art.",
            "🧩 Jeux de manipulation pour éveiller sa motricité.",
            "📖 Comptines illustrées pour enrichir son imaginaire.",
        ],
        conclusion: "Offrez-lui des moments d’émerveillement tout en partageant des instants magiques ensemble. 💕",
        tags: [
            { label: "Éveil & Motricité", color: "yellow" },
            { label: "Coloriages", color: "blue" },
            { label: "Comptines", color: "orange" }
        ]
    },
    {
        title: "Dès 3 ans",
        color: "rgb(2 141 2)",
        buttonImage: D3,
        imageCard: D3,
        slug: "des-3-ans",
        content: "Dès 3 ans : créativité et premières découvertes 🌈",
        description: "Accompagnez votre enfant dans ses premières aventures créatives et éducatives :",
        activities: [
            "🎨 Coloriages thématiques pour éveiller leur imagination.",
            "✂️ Premiers bricolages simples pour créer avec leurs petites mains.",
            "🔵 Jeux de reconnaissance des formes et des couleurs pour apprendre en s’amusant.",
        ],
        conclusion: "Transformez chaque journée en une nouvelle découverte ludique et enrichissante. ✨",
        tags: [
            { label: "Créativité", color: "green" },
            { label: "Bricolage", color: "red" },
            { label: "Jeux éducatifs", color: "blue" }
        ]
    },
    {
        title: "Dès 6 ans",
        color: "#CF000F",
        buttonImage: D6,
        imageCard: D6,
        slug: "des-6-ans",
        content: "Dès 6 ans : exploration et autonomie 🚀",
        description: "Place à l’imagination débordante et aux premières explorations ! Votre enfant pourra :",
        activities: [
            "🎨 Réaliser des bricolages plus élaborés pour exprimer sa créativité.",
            "🖌️ Découvrir des activités artistiques pour développer son goût pour le dessin et la peinture.",
            "🧠 Participer à des jeux de logique et des défis amusants pour réfléchir tout en s’amusant.",
        ],
        conclusion: "Encouragez-le à relever ses premiers défis et à développer son autonomie en toute confiance ! 🌟",
        tags: [
            { label: "Activités artistiques", color: "blue" },
            { label: "Jeux de logique", color: "red" },
            { label: "Défis éducatifs", color: "orange" }
        ]
    },
    {
        title: "Dès 10 ans",
        color: "#0066D5",
        buttonImage: D8,
        imageCard: D8,
        slug: "des-10-ans",
        content: "Dès 10 ans : création et défis stimulants 🧠🎨",
        description: "Pour les esprits curieux et les créateurs en herbe, découvrez des activités captivantes :",
        activities: [
            "🛠️ Participer à des ateliers DIY pour concevoir leurs propres créations.",
            "🧩 Résoudre des jeux d’énigmes et de réflexion pour stimuler leur logique.",
            "🎭 S’engager dans des projets créatifs avancés pour laisser libre cours à leur imagination.",
        ],
        conclusion: "Offrez-leur des outils pour s’épanouir et exprimer pleinement leur créativité tout en s’amusant. 🌟",
        tags: [
            { label: "DIY & Création", color: "green" },
            { label: "Énigmes & Réflexion", color: "red" },
            { label: "Projets créatifs", color: "blue" }
        ]
    },
];



// export const news: News[] = [
//     { id: 1, image: N1, title: "exemple 1", iconSrc: ABC, description: "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "11/11/11" },
//     { id: 2, image: N2, title: "exemple 2", iconSrc: ABC, description: "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "11/11/11" },
//     { id: 3, image: N3, title: "exemple 3", iconSrc: ABC, description: "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "11/11/11" },
//     { id: 4, image: N1, title: "exemple 4", iconSrc: ABC, description: "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "11/11/11" },
//     { id: 5, image: N1, title: "exemple 5", iconSrc: Chariot, description: "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "11/11/11" },
//     { id: 6, image: N1, title: "exemple 6", iconSrc: Blocs, description: "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "11/11/11" },
//     { id: 7, image: N1, title: "exemple 7", iconSrc: Toys, description: "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "11/11/11" },
//     { id: 8, image: N1, title: "exemple 8", iconSrc: ABC, description: "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "11/11/11" },
// ];

// export const ideas: Idea[] = [
//     { id: 1, image: N1, title: "Titre", description: "Lorem ipsum" },
//     { id: 2, image: N2, title: "Titre", description: "Lorem ipsum" },
//     { id: 3, image: N3, title: "Titre", description: "Lorem ipsum" },
//     { id: 4, image: N2, title: "Titre", description: "Lorem ipsum" },
// ];



export const activities: Record<ActivityCategory, Activity[]> = {
    trivium: [
        {
            title: "Grammaire",
            icon: "/icons/lecture.png",
            link: "/grammaire",
        },
        {
            title: "Logique",
            icon: "/icons/defis.png",
            link: "/logique",
        },
        {
            title: "Rhétorique",
            icon: "/icons/debat.png",
            link: "/rhetorique",
        },
    ],
    quadrivium: [
        {
            title: "Arithmétique",
            icon: "/icons/chiffre.png",
            link: "/arithmetique",
        },
        {
            title: "Géométrie",
            icon: "/icons/lego.png",
            link: "/geometrie",
        },
        {
            title: "Musique",
            icon: "/icons/musique.png",
            link: "/musique",
        },
        {
            title: "Astronomie",
            icon: "/icons/etoile.png",
            link: "/astronomie",
        },
    ]

    // grammaire: [
    //     { title: "Coloriages & Dessin", icon: "/icons/crafts.png", link: "/coloriages" },
    //     { title: "Histoires & Comptines", icon: "/icons/lecture.png", link: "/histoires-comptines" },
    //     { title: "Musique & Chansons", icon: "/icons/musique.png", link: "/musique-chansons" },
    //     { title: "Activités Manuelles", icon: "/icons/craft.png", link: "/activites-manuelles" },
    //     { title: "Peinture et collage", icon: "/icons/peinture.png", link: "/peinture-collage" },
    //     { title: "Marionnettes & Jeux sensoriels", icon: "/icons/marionnettes.png", link: "/marionnettes-sensoriel" },
    // ],
    // logique: [
    //     { title: "Construction & Lego", icon: "/icons/lego.png", link: "/construction-lego" },
    //     { title: "Défis éducatifs & Enigmes", icon: "/icons/defis.png", link: "/defis-educatifs" },
    //     { title: "Jeux éducatifs", icon: "/icons/des.png", link: "/jeux-educatifs" },
    //     { title: "Jeux de réflexion & stratégie", icon: "/icons/strategie.png", link: "/jeux-strategie" },
    //     { title: "Expériences scientifiques", icon: "/icons/science.png", link: "/sciences-enfants" },
    //     { title: "Mathématiques ludiques", icon: "/icons/chiffre.png", link: "/maths-ludiques" },
    // ],
    // rhetorique: [
    //     { title: "Théâtre & Jeux de rôle", icon: "/icons/theatre.png", link: "/theatre-jeux-role" },
    //     { title: "Projets DIY & Création", icon: "/icons/diy.png", link: "/projets-diy" },
    //     { title: "Rédaction d’histoires", icon: "/icons/redaction.png", link: "/redaction-histoires" },
    //     { title: "Expression orale & Débats", icon: "/icons/debat.png", link: "/expression-orale" },
    //     { title: "Création de mini-magazines", icon: "/icons/magazine.png", link: "/mini-magazine" },
    //     { title: "Stop-motion et cinéma", icon: "/icons/cinema.png", link: "/cinema-stopmotion" },
    // ],
    // motricite: [
    //     { title: "Parcours moteur", icon: "/icons/parcours.png", link: "/parcours-moteur" },
    //     { title: "Équilibre & Coordination", icon: "/icons/mobilite.png", link: "/equilibre-coordination" },
    //     { title: "Jeux de ballon", icon: "/icons/ballon.png", link: "/jeux-ballon" },
    //     { title: "Danse & Mouvement", icon: "/icons/danse.png", link: "/danse-mouvement" },
    //     { title: "Concentration & Discipline", icon: "/icons/discipline.png", link: "/arts-martiaux" },
    //     { title: "Agilité & Créativité motrice", icon: "/icons/agilite.png", link: "/cirque-jonglage" },
    // ]
};
