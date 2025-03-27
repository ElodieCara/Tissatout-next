
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";
import Image from "next/image";
import Link from "next/link";
import { Advice } from "@prisma/client";

function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


export default function AgePage({ ageCategory, agePageBanner }: { ageCategory: any, agePageBanner: string }) {
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
            <section>
                <h2>🎨 Coloriages pour {ageCategory.title}</h2>
                <div className="grid">
                    {ageCategory.drawings?.length > 0 ? (
                        ageCategory.drawings.map(({ drawing }: any) => (
                            <Link key={drawing.id} href={`/coloriages/${drawing.slug}`} className="card">
                                <h3>{drawing.title}</h3>
                                <p>{drawing.description}</p>
                            </Link>
                        ))
                    ) : (
                        <p>Aucun coloriage disponible.</p>
                    )}
                </div>
            </section>

            {/* Idées d’activités */}
            <section>
                <h2>💡 Idées d'activités pour {ageCategory.title}</h2>
                <div className="grid">
                    {ageCategory.ideas?.length > 0 ? (
                        ageCategory.ideas.map(({ idea }: any) => (
                            <Link key={idea.id} href={`/idees/${idea.slug}`} className="card">
                                <h3>{idea.title}</h3>
                                <p>{idea.description}</p>
                            </Link>
                        ))
                    ) : (
                        <p>Aucune idée disponible.</p>
                    )}
                </div>
            </section>


        </div>
    );
}
