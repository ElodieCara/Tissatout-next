
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";
import Image from "next/image";
import DrawingSlider from "../../../components/DrawingSlide/DrawingSlide";
import Link from "next/link";
import { Advice, Idea } from "@prisma/client";
import { drawingDescriptions } from "../../../data/drawingDescription";
import themeImages from '@/data/themeIdeasImage';

function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


export default function AgePage({ ageCategory, agePageBanner }: { ageCategory: any, agePageBanner: string }) {

    const ageKey = ageCategory.title.toLowerCase();
    const description = drawingDescriptions[ageKey];

    return (
        <div>
            <header>
                <Banner
                    src={agePageBanner}
                    title={ageCategory.title}
                    description={ageCategory.description} />
            </header>

            <section className="age">
                <div className="age__intro">

                    <div className="age__image">
                        <Image
                            src={ageCategory.imageCard || "/images/default-banner.jpg"}
                            alt={ageCategory.title}
                            width={800}
                            height={600}
                        />
                    </div>

                    <div className="age__icon">
                        <Image
                            src="/assets/rubanJaune.svg"
                            alt="Ruban jaune"
                            width={50}
                            height={50}
                        />
                    </div>

                    <div className="age__text">
                        <h1 className="age__text__title">{ageCategory.title}</h1>
                        <p className="age__text__description">{ageCategory.description}</p>
                    </div>

                </div>
            </section>

            {/* Exemple pour les articles */}
            <section className="articles">
                <div className="articles__header">
                    <h2>📚 Articles pour {ageCategory.title}</h2>
                    <Button className="large"><Link href="/articles" className="articles__link-button">Voir tous les articles</Link></Button>
                </div>

                <div className="articles__grid">
                    {ageCategory.articles?.length > 0 ? (
                        ageCategory.articles.map(({ article }: any, index: number) => (
                            <Link key={article.id} href={`/articles/${article.slug}`} className={`articles__card ${index % 2 !== 0 ? 'reverse' : ''}`}>
                                <div className="articles__image">
                                    <Image src={article.image || "/images/default-article.jpg"} alt={article.title} width={500} height={300} />
                                </div>

                                <div className={`articles__content ${index % 2 !== 0 ? 'reverse' : ''}`}>
                                    <div className="articles__separator"></div>
                                    <div className="articles__content__text">
                                        <h3 className="articles__title">{article.title}</h3>
                                        <p className="articles__description">{article.description}</p>
                                        <button className="articles__button">Lire l'article</button>
                                    </div>
                                </div>

                            </Link>
                        ))
                    ) : (
                        <p>Aucun article disponible.</p>
                    )}
                </div>
            </section>

            {/* Conseils pour les parents */}
            <section className="advices">
                <div className="advices__header">
                    <h2>🧸 Conseils pour {ageCategory.title.toLowerCase()}</h2>
                    <Button className="large"><Link href="/conseils" className="advices__link-button">Voir tous les conseils</Link></Button>
                </div>

                <div className="advices__grid">
                    {ageCategory.advices?.length > 0 ? (
                        <>
                            {/* Grand conseil principal */}
                            <Link href={`/conseils/${ageCategory.advices[0].advice.slug}`} className="advices__main-card">
                                <div className="advices__main-card__badge">Nouveau</div>
                                <Image
                                    src={ageCategory.advices[0].advice.imageUrl || "/images/default-advice.jpg"}
                                    alt={ageCategory.advices[0].advice.title}
                                    width={800}
                                    height={400}
                                />
                                <div className="advices__main-card__info">
                                    <p>By Tissatout</p>
                                    <h3>{ageCategory.advices[0].advice.title}</h3>
                                    <span className="advices__date">{formatDate(ageCategory.advices[0].advice.createdAt)}</span>
                                    <p>{ageCategory.advices[0].advice.description}</p>
                                </div>
                            </Link>

                            {/* Les 3 suivants à droite */}
                            <div className="advices__side-list">
                                {ageCategory.advices.slice(1, 5).map(({ advice }: { advice: Advice }) => (
                                    <Link key={advice.id} href={`/conseils/${advice.slug}`} className="advices__mini-card">
                                        <Image
                                            src={advice.imageUrl || "/images/default-advice.jpg"}
                                            alt={advice.title}
                                            width={100}
                                            height={100}
                                        />
                                        <div className="advices__mini-card__info">
                                            <p>By Tissatout</p>
                                            <h4>{advice.title}</h4>
                                            <span className="advices__date">{formatDate(advice.createdAt)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>Aucun conseil disponible.</p>
                    )}

                </div>
            </section>

            {/* Dessins à colorier */}
            <section className="drawings">
                <div className="drawings__header">
                    <h2>🎨 Coloriages {ageCategory.title.toLowerCase()}</h2>
                    <Button className="large"><Link href="/coloriages">Voir tous les coloriages</Link></Button>
                </div>

                {ageCategory.drawings && ageCategory.drawings.length > 0 ? (
                    <>
                        <div className="drawings__content">
                            {/* 🖼️ Carte de gauche avec le premier dessin */}
                            <Link
                                href={`/coloriages/${ageCategory.drawings[0].drawing.slug}`}
                                className="drawings__highlight"
                            >
                                <Image
                                    src={ageCategory.drawings[0].drawing.imageUrl || "/images/default.jpg"}
                                    alt={ageCategory.drawings[0].drawing.title}
                                    width={300}
                                    height={300}
                                />
                                <div className="drawings__content__text">
                                    <div className="drawings__content__text__separator"></div>
                                    <div className="drawings__content__text__block">
                                        <h3>Dès {ageCategory.title}</h3>
                                        <p>{ageCategory.drawings.length} coloriages</p>
                                    </div>
                                </div>
                            </Link>

                            {/* 🎠 Slider à droite avec les suivants */}
                            <DrawingSlider
                                drawings={ageCategory.drawings
                                    .slice(1) // on enlève le premier car déjà à gauche
                                    .map((d: any) => d.drawing)}
                            />
                        </div>

                        <div className="drawings__description-block">
                            <h4 className="drawings__description-block__title">
                                {description?.title || `Coloriages ${ageKey} à imprimer gratuitement`}
                            </h4>
                            <p className="drawings__description-block__text">
                                {description?.text ||
                                    `Découvrez une sélection de coloriages pensés pour les enfants ${ageKey}, à imprimer pour apprendre, s'amuser et développer la motricité fine.`}
                            </p>
                        </div>
                    </>
                ) : (
                    <p className="drawings__empty">Aucun coloriage disponible.</p>
                )}
            </section>





            {/* Idées d’activités */}
            <section className="ideas">
                <div className="ideas__header">
                    <h2>💡 Idées d’activités pour {ageCategory.title}</h2>
                </div>

                <div className="ideas__grid">
                    {ageCategory.ideas?.length > 0 ? (
                        ageCategory.ideas.map(({ idea }: { idea: Idea }) => {
                            // Utilisation d'une clé correcte pour accéder au thème et d'une valeur par défaut si l'icône n'existe pas
                            const themeKey = idea.theme.toLowerCase() as keyof typeof themeImages;
                            const icon = themeImages[themeKey]?.icon || themeImages.default.icon;
                            const background = themeImages[themeKey]?.background || themeImages.default.background;

                            return (
                                <Link key={idea.id} href={`/idees/${idea.id}`} className="ideas__card">
                                    <div className="ideas__card__icon">
                                        <Image
                                            src={icon}
                                            alt={idea.theme}
                                            width={140}
                                            height={140}
                                        />
                                    </div>
                                    <h3 className="ideas__card__title">{idea.title}</h3>
                                    <p className="ideas__card__description">{idea.description}</p>
                                    <span className="ideas__card__link">➔</span>

                                    <div
                                        className="ideas__card__background"
                                        style={{
                                            backgroundImage: `url(${themeImages[idea.theme as keyof typeof themeImages]?.background || themeImages.default.background})`,
                                            backgroundSize: "",  // Couvre toute la surface de la card
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "150%",
                                            height: "100%",
                                            zIndex: -1,
                                            imageRendering: "auto",

                                        }}
                                    />
                                </Link>
                            );
                        })
                    ) : (
                        <p className="ideas__empty">Aucune idée disponible pour cette tranche d’âge.</p>
                    )}
                </div>
            </section>


        </div>
    );
}
