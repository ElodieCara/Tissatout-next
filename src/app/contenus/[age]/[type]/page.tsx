import { notFound } from "next/navigation";
import ContentList from "@/components/ContentList/ContentList";
import { getContenusParAgeEtType } from "@/lib/contenus";
import Banner from "@/components/Banner/Banner";
import { prisma } from "@/lib/prisma";

interface PageProps {
    params: {
        age: string;
        type: string;
    };
}

const bannerImages: Record<string, string> = {
    articles: "/banners/banner-articles.png",
    idees: "/banners/banner-idees.png",
    trivium: "/banners/banner-trivium.png",
    quadrivium: "/banners/banner-quadrivium.png",
};

const titleMap: Record<string, string> = {
    articles: "📚 Articles pour les petits curieux",
    idees: "🎨 Activités et idées créatives",
    trivium: "📘 Activités Trivium",
    quadrivium: "📗 Activités Quadrivium",
};


export default async function ContentByAgePage(props: PageProps) {
    const { age, type } = props.params;
    const settings = await prisma.siteSettings.findFirst();

    const validTypes = ["articles", "conseils", "idees", "trivium", "quadrivium"];
    if (!validTypes.includes(type)) return notFound();

    const ageCategory = await prisma.ageCategory.findUnique({
        where: { slug: age },
    });

    if (!ageCategory) return notFound();

    const descriptionMap: Record<string, string> = {
        articles: `Des articles adaptés à l'âge de ${ageCategory.title} pour nourrir la curiosité.`,
        idees: `Des idées ludiques et éducatives pour éveiller la créativité des enfants de ${ageCategory.title}.`,
        trivium: `Grammaire, logique et rhétorique dès ${ageCategory.title} ? C’est possible avec des activités amusantes.`,
        quadrivium: `Mathématiques, musique, astronomie et géométrie adaptées aux ${ageCategory.title}.`,
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
            <Banner
                src={bannerImages[type]}
                title={titleMap[type]}
                description={descriptionMap[type]}
            />

            {/* <h1>Contenus {type} pour {age}</h1> */}
            <ContentList items={data} type={type} />
        </main>
    );
}
