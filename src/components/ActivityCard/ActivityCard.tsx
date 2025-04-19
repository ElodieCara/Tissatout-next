type Props = {
    title: string;
    imageUrl: string;
    ageMin: number;
    ageMax: number;
    pdfUrl: string;
    isPrintable: boolean;
};

export default function ActivityCard({ title, imageUrl, ageMin, ageMax, pdfUrl, isPrintable }: Props) {
    return (
        <article className="activites__card">
            <img src={imageUrl} alt={title} className="activites__image" />
            <h3 className="activites__card-title">{title}</h3>
            <p className="activites__card-age">{ageMin}–{ageMax} ans</p>
            <div className="activites__cta">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="activites__cta-btn">
                    📄 Télécharger PDF
                </a>
                {isPrintable && (
                    <button className="activites__cta-btn">📦 Commander plastifiée</button>
                )}
            </div>
        </article>
    );
}
