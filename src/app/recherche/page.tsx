import { prisma } from "@/lib/prisma";

interface SearchPageProps {
    searchParams?: { query?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams?.query?.trim();

    if (!query) {
        return (
            <main className="search-page">
                <h1 className="search-page__title">Aucune recherche effectuée</h1>
                <p className="search-page__subtitle">Veuillez entrer un mot-clé dans la barre prévue à cet effet.</p>
            </main>
        );
    }

    // Recherche dans plusieurs tables
    const [articles, activities, ideas, advices, lessons, printableGames] = await Promise.all([
        prisma.article.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { content: { contains: query, mode: "insensitive" } },
                ],
            },
            orderBy: { date: "desc" },
        }),
        prisma.activity.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
        }),
        prisma.idea.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
        }),
        prisma.advice.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { content: { contains: query, mode: "insensitive" } },
                ],
            },
        }),
        prisma.lesson.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { content: { contains: query, mode: "insensitive" } },
                ],
            },
        }),
        prisma.printableGame.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
        }),
    ]);

    const resultsCount =
        articles.length +
        activities.length +
        ideas.length +
        advices.length +
        lessons.length +
        printableGames.length;

    if (resultsCount === 0) {
        return (
            <main className="search-page">
                <h1 className="search-page__title">Aucun résultat trouvé pour : <strong>{query}</strong></h1>
                <p className="search-page__subtitle">Essaye un autre mot-clé.</p>
            </main>
        );
    }

    return (
        <main className="search-page">
            <h1 className="search-page__title">Résultats pour : <strong>{query}</strong></h1>

            <section className="search-page__results">

                {articles.length > 0 && (
                    <div className="search-page__section">
                        <h2 className="search-page__section-title">Articles</h2>
                        <ul className="search-page__list">
                            {articles.map(article => (
                                <li key={article.id} className="search-page__list-item">
                                    <a href={`/articles/${article.slug}`} className="search-page__link">
                                        ➔ {article.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activities.length > 0 && (
                    <div className="search-page__section">
                        <h2 className="search-page__section-title">Activités</h2>
                        <ul className="search-page__list">
                            {activities.map(activity => (
                                <li key={activity.id} className="search-page__list-item">
                                    ➔ {activity.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {ideas.length > 0 && (
                    <div className="search-page__section">
                        <h2 className="search-page__section-title">Idées</h2>
                        <ul className="search-page__list">
                            {ideas.map(idea => (
                                <li key={idea.id} className="search-page__list-item">
                                    <a href={`/idees/${idea.slug}`} className="search-page__link">
                                        ➔ {idea.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {advices.length > 0 && (
                    <div className="search-page__section">
                        <h2 className="search-page__section-title">Conseils</h2>
                        <ul className="search-page__list">
                            {advices.map(advice => (
                                <li key={advice.id} className="search-page__list-item">
                                    <a href={`/conseils/${advice.slug}`} className="search-page__link">
                                        ➔ {advice.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {lessons.length > 0 && (
                    <div className="search-page__section">
                        <h2 className="search-page__section-title">Leçons</h2>
                        <ul className="search-page__list">
                            {lessons.map(lesson => (
                                <li key={lesson.id} className="search-page__list-item">
                                    <a href={`/trivium/${lesson.slug}`} className="search-page__link">
                                        ➔ {lesson.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {printableGames.length > 0 && (
                    <div className="search-page__section">
                        <h2 className="search-page__section-title">Jeux à Imprimer</h2>
                        <ul className="search-page__list">
                            {printableGames.map(game => (
                                <li key={game.id} className="search-page__list-item">
                                    <a href={`/jeux-imprimables/${game.slug}`} className="search-page__link">
                                        ➔ {game.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </section>
        </main>
    );
}
