import Button from "@/components/Button/Button";
import Image from "next/image";
import DrawingSlider from "../../../components/DrawingSlide/DrawingSlide";
import Link from "next/link";
import { Advice, Idea } from "@prisma/client";
import { drawingDescriptions } from "../../../data/drawingDescription";
import { getAllAgeCategories } from "../../../lib/ages";
import themeImages from '@/data/themeIdeasImage';
import AgeCarouselWrapper from "@/components/AgeCarousel/AgeCarouselwrapper";
import BackToTop from "@/components/BackToTop/BackToTop";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";


const allAges = await getAllAgeCategories();

const formattedAges = allAges.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    icon: a.imageCard || "/images/default.png", // chemin que tu veux pour l'icône
    image: a.imageCard || "/images/default.png", // ou imageBanner
}));


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
    console.log("Advices:", ageCategory.advices);
    console.log("Ideas:", ageCategory.ideas);

    return (
        <div>
            <header>
                <section className="age">
                    <div className="age__intro">
                        <div className="age__image">
                            <Image
                                src={ageCategory.imageCard || agePageBanner || "/images/default.png"}
                                alt={ageCategory.title}
                                width={600}
                                height={600}
                            />

                            <Button
                                href="#articles"
                                className="age__image-cta">
                                <span className="age__image-cta-text">Découvrir les activités</span>
                            </Button>

                            {/* <AgeCarouselWrapper ages={formattedAges} currentSlug={ageCategory.slug} /> */}

                        </div>
                        <div className="age__text">
                            <div className="age__icon">
                                <Image
                                    src="/assets/rubanJaune.svg"
                                    alt="Ruban jaune"
                                    width={50}
                                    height={50}
                                />
                                <h1 className="age__text__title">{ageCategory.title}</h1>
                            </div>


                            <p className="age__text__description">{ageCategory.description}</p>

                            {ageCategory.content && (
                                <div className="age__text__content">
                                    {ageCategory.content
                                        .split("\n")
                                        .map((line: string, idx: number) => (
                                            <p key={idx}>{line}</p>
                                        ))}
                                </div>
                            )}

                            {ageCategory.activityList?.some((a: string) => a.trim() !== "") && (
                                <div className="age__activities">
                                    <ul className="age__activity-list">
                                        {ageCategory.activityList
                                            .filter((activity: string) => activity.trim() !== "")
                                            .map((activity: string, i: number) => (
                                                <li key={i}>{activity}</li>
                                            ))}
                                    </ul>
                                </div>
                            )}

                            {ageCategory.conclusion && (
                                <div className="age__conclusion">
                                    <blockquote>{ageCategory.conclusion}</blockquote>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </header>


            <main className="age__main">
                <Breadcrumb
                    crumbs={[
                        { label: "Accueil", href: "/" },
                        { label: "Nos univers", href: "/nos-univers" },
                        { label: ageCategory.title } // page actuelle, pas de href
                    ]}
                />

                {/* Exemple pour les articles */}
                <section id="articles" className="articles">

                    <div className="articles__header">
                        <div className="articles__text">
                            <h2>Articles pour {ageCategory.title}</h2>
                            <p className="articles__text-intro">
                                Des idées, des conseils et des ressources pratiques pour accompagner les enfants de {ageCategory.title.toLowerCase()} dans leur développement au quotidien.
                            </p>
                        </div>
                        <Button className="large"><Link href={`/contenus/${ageCategory.slug}/articles`} className="articles__link-button">Voir tous les articles</Link></Button>
                    </div>

                    <div className="articles__grid">
                        {ageCategory.articles?.length > 0 ? (
                            ageCategory.articles
                                .slice(0, 3)
                                .map(({ article }: any, index: number) => (
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
                    <div className="articles__footer-text">
                        <p>Chez Tissatout, nous croyons que chaque âge mérite une approche adaptée.
                            Ces articles sont pensés pour accompagner votre enfant dans ses découvertes, ses apprentissages et ses petites grandes questions du quotidien.
                            Vous y trouverez des pistes concrètes pour soutenir son développement, éveiller sa curiosité et enrichir les échanges à la maison.</p>
                    </div>
                </section>

                {/* Conseils pour les parents */}
                <section className="advices">
                    <div className="advices__header">
                        <div className="advices__text">
                            <h2>Conseils pour {ageCategory.title.toLowerCase()}</h2>
                            <p className="advices__text-intro">
                                Retrouvez des conseils concrets pour les parents d’enfants de {ageCategory.title.toLowerCase()}. Astuces éducatives, repères pédagogiques et pistes de réflexion.
                            </p>
                        </div>
                        <Button className="large"><Link href={`/contenus/${ageCategory.slug}/conseils`} className="advices__link-button">Voir tous les conseils</Link></Button>
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
                                    {ageCategory.advices
                                        .filter((a: any) => a?.advice) // sécurité
                                        .slice(1, 5)
                                        .map(({ advice }: { advice: Advice }) => (
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
                    <div className="advices__footer-text">
                        <p> Ce que l’on ne comprend pas, on le répète. Ce que l’on n’analyse pas, on l’imite.
                            Le Trivium, c’est l’inverse : un apprentissage qui libère, parce qu’il éclaire.
                            Ces pistes sont là pour ça : aider à penser, pas à obéir. <br />

                            On commence par nommer le monde. Puis on apprend à voir clair. Enfin, à le dire.
                            C’est l’ordre naturel : grammaire, logique, rhétorique.
                            Ces conseils n’éduquent pas : ils accompagnent cette montée lente vers l’intelligence.
                        </p>
                    </div>
                </section>

                {/* Dessins à colorier */}
                <section className="drawings">
                    <div className="drawings__header">
                        <div className="drawings__text">
                            <h2>Coloriages {ageCategory.title.toLowerCase()}</h2>
                            <p className="drawings__text-intro">
                                Imprimez gratuitement des coloriages adaptés aux enfants de {ageCategory.title.toLowerCase()} : formes simples, animaux rigolos, mandalas doux et symboles éducatifs.
                            </p>
                        </div>
                        <Button className="large"><Link href="/coloriages">Voir tous les coloriages</Link></Button>
                    </div>


                    {ageCategory.drawings && ageCategory.drawings.length > 0 ? (
                        <>
                            <div className="drawings__content">
                                {/* 🖼️ Carte de gauche avec le premier dessin */}
                                <Link
                                    href={`/coloriages/${encodeURIComponent(ageCategory.drawings[0]?.drawing?.slug)}`}
                                    className="drawings__highlight"
                                >
                                    <Image
                                        src={ageCategory.drawings[0].drawing.imageUrl || "/images/default.jpg"}
                                        alt={ageCategory.drawings[0]?.drawing.title ?? "Coloriage non trouvé"}
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
                        <div className="ideas__text">
                            <h2>Idées d’activités pour {ageCategory.title}</h2>
                            <p className="ideas__text-intro">
                                Activités manuelles, jeux créatifs, petites expériences et découvertes sensorielles pour éveiller les enfants de {ageCategory.title.toLowerCase()}.
                            </p>
                        </div>
                        <Button className="large"><Link href={`/contenus/${ageCategory.slug}/idees`}>Voir toutes les idées</Link></Button>
                    </div>

                    <div className="ideas__grid">
                        {ageCategory.ideas?.length > 0 ? (
                            ageCategory.ideas
                                .filter((i: any) => i?.idea)
                                .slice(0, 6)
                                .map(({ idea }: { idea: Idea }) => {
                                    // Utilisation d'une clé correcte pour accéder au thème et d'une valeur par défaut si l'icône n'existe pas
                                    const themeKey = idea.theme.toLowerCase() as keyof typeof themeImages;
                                    const icon = themeImages[themeKey]?.icon || themeImages.default.icon;
                                    const background = themeImages[themeKey]?.background || themeImages.default.background;

                                    return (
                                        <Link key={idea.id} href={`/idees/${idea.slug}`} className="ideas__card">
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
                    <div className="ideas__footer-text">
                        <p>
                            On commence toujours par toucher avant de comprendre.
                            Ces activités donnent forme à l’abstrait : elles accompagnent les enfants de {ageCategory.title.toLowerCase()} dans leurs découvertes, leur curiosité et leur créativité.
                            À travers le geste, elles révèlent la structure, la suite, la cause, le rythme.
                            Elles forment sans le dire, éveillent sans surcharger.
                        </p>
                    </div>
                </section>
                <BackToTop />
            </main>
        </div>
    );
}
