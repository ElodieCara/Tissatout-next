
import Banner from "@/components/Banner/Banner";
import Image from "next/image";
import Link from "next/link";

export default function AgePage({ ageCategory }: { ageCategory: any }) {
    return (
        <div>
            <header>
                <Banner
                    src="/assets/slide3.png"
                    title="💡À chaque âge ses trésors d’activités"
                    description=": Coloriages, conseils, inspirations et savoirs : retrouvez ici tout ce qui correspond aux besoins et au rythme de votre enfant."
                />
            </header>


            <section className="age">
                <div className="age__intro">
                    <Image
                        src={ageCategory.imageCard || "/images/default-banner.jpg"}
                        alt={ageCategory.title}
                        width={1200}
                        height={400}
                        priority
                    />
                    <span className="age__icon">👶</span>
                    <div className="age__text">
                        <h1 className="age__title">{ageCategory.title}</h1>
                        <p className="age__description">{ageCategory.description}</p>
                    </div>

                </div>
            </section>
            {/* Exemple pour les articles */}
            <section>
                <h2>📚 Articles</h2>
                <div className="grid">
                    {ageCategory.articles?.length > 0 ? (
                        ageCategory.articles.map(({ article }: any) => (
                            <Link key={article.id} href={`/articles/${article.slug}`} className="card">
                                <h3>{article.title}</h3>
                                <p>{article.description}</p>
                            </Link>
                        ))
                    ) : (
                        <p>Aucun article disponible.</p>
                    )}
                </div>
            </section>

            {/* Et idem pour les autres types */}
        </div>
    );
}
