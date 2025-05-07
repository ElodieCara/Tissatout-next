import { notFound } from "next/navigation";
import ContentList from "@/components/ContentList/ContentList";
import { getContenusParAgeEtType } from "@/lib/contenus";
import { prisma } from "@/lib/prisma";
import OpenAgeSidebarButton from "@/components/OpenAgeSidebarButton/OpenAgeSidebarButton";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import BackToTop from "@/components/BackToTop/BackToTop";
import Button from "@/components/Button/Button";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

interface PageProps {
    params: {
        age: string;
        type: string;
    };
}

const bannerImages: Record<string, string> = {
    articles: "/banners/banner-articles.png",
    conseils: "/banners/banner-conseils.png",
    idees: "/banners/banner-idees.png",
    trivium: "/banners/banner-trivium.png",
    quadrivium: "/banners/banner-quadrivium.png",
    coloriages: "/banners/banner-coloriages.png",

};

const titleMap: Record<string, string> = {
    articles: "Articles pour les petits curieux en herbe",
    conseils: "Conseils pour les aider à rêver et penser",
    idees: "Activités et idées créatives pour petits artistes",
    trivium: "Activités Trivium pour jouer avec les mots et l'esprit",
    quadrivium: "Découvertes Quadrivium pour petits explorateurs du savoir",
    coloriages: "Coloriages à imprimer pour rêver, apprendre et s’amuser",
};

export const sectionIcons: Record<string, string> = {
    articles: "/icons/titres/livre.png",
    conseils: "/icons/titres/nounours.png",
    idees: "/icons/titres/crayons.png",
    trivium: "/icons/titres/loupe.png",
    quadrivium: "/icons/titres/quadrivium.png",
    coloriages: "/icons/titres/coloriages.png",
};

export default async function ContentByAgePage(props: PageProps) {
    const { age, type } = props.params;
    const settings = await prisma.siteSettings.findFirst();

    const validTypes = ["articles", "conseils", "idees", "trivium", "quadrivium", "coloriages"];
    if (!validTypes.includes(type)) return notFound();

    const ageCategory = await prisma.ageCategory.findUnique({
        where: { slug: age },
    });

    if (!ageCategory) return notFound();

    const descriptionMap: Record<string, string> = {
        articles: `Des articles adaptés à l'âge de ${ageCategory.title} pour nourrir la curiosité.`,
        conseils: `Des pistes tendres et concrètes pour soutenir les enfants de ${ageCategory.title} dans leur monde en construction.`,
        idees: `Des idées ludiques et éducatives pour éveiller la créativité des enfants de ${ageCategory.title}.`,
        trivium: `Grammaire, logique et rhétorique dès ${ageCategory.title} ? C’est possible avec des activités amusantes.`,
        quadrivium: `Mathématiques, musique, astronomie et géométrie adaptées aux ${ageCategory.title}.`,
        coloriages: `Des dessins simples à imprimer pour les enfants de ${ageCategory.title} : amusants, éducatifs, ou inspirés des saisons.`,
    };

    const data = await getContenusParAgeEtType(age, type);

    if (!data || data.length === 0) {
        return (
            <main className="content-age-page">
                <h1>Contenus {type} pour {age}</h1>
                <p>Aucun contenu trouvé pour cette tranche d'âge.</p>
            </main>
        );
    }

    return (
        <main className="content-age-page">
            <OpenAgeSidebarButton />

            <SectionIntro
                iconSrc={sectionIcons[type]}
                title={titleMap[type]}
                description={descriptionMap[type]}
                imageSrc={bannerImages[type]}
                backgroundColor="#2c3f64"
                type={type}
            />

            <BackToTop />

            <ContentList
                items={data}
                type={type}
                age={ageCategory.title}
            />

        </main>
    );
}
