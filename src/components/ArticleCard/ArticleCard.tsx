import Image, { StaticImageData } from "next/image";

type ArticleCardProps = {
    iconSrc: string | StaticImageData; // Ne permet plus `undefined`
    title: string;
    description: string;
    date?: string;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ iconSrc, title, description, date }) => {
    return (
        <div className="articles-gallery">
            <div className="articles-gallery__icon">
                {iconSrc && (
                    <Image className="img"
                        src={iconSrc}
                        alt={title}
                        loading="lazy"
                        width={100}
                        height={100}
                        unoptimized={false}
                    />
                )}
            </div>
            <div className="articles-gallery__body">
                <div className="articles-gallery__body__title">{title}</div>
                <div className="articles-gallery__body__description">{description}</div>
                {date && <div className="articles-gallery__body__date">{date}</div>}
            </div>
        </div>
    );
};

export default ArticleCard;
