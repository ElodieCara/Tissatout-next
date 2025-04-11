"use client";

interface RubanUniversProps {
    title: string;
    subtitle: string;
    cards: {
        title: string;
        icon: string;
        alt: string;
        text: string;
    }[];
    conclusion: string;
}


export default function RubanUnivers({ title, subtitle, cards, conclusion }: RubanUniversProps) {
    return (
        <section className="trivium-info">
            <h3 className="trivium-info__title">{title}</h3>
            <p className="trivium-info__subtitle">{subtitle}</p>

            <div className="trivium-info__cards">
                {cards.map((card, index) => (
                    <div className="trivium-info__card" key={index}>
                        <h3 className="trivium-info__card-title">{card.title}</h3>
                        <img src={card.icon} alt={card.alt} className="trivium-info__icon" />
                        <p className="trivium-info__card-text">{card.text}</p>
                    </div>
                ))}
            </div>

            <p className="trivium-info__conclusion">
                <strong>Son but :</strong> {conclusion}
            </p>
        </section>
    );
}
