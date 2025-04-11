import React from 'react';

interface MysteryCardProps {
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonAction: () => void;
    secondaryButtonText: string;
    secondaryButtonAction: () => void;
    imageSrc: string;
    alt: string;
}

const MysteryCard: React.FC<MysteryCardProps> = ({
    title,
    description,
    primaryButtonText,
    primaryButtonAction,
    secondaryButtonText,
    secondaryButtonAction,
    imageSrc,
    alt
}) => {
    return (
        <section className="activity-mystery">
            <div className="activity-mystery__content">
                <h2 className="activity-mystery__title">{title}</h2>
                <p className="activity-mystery__text">{description}</p>
                <div className="activity-mystery__buttons">
                    <button className="btn btn--primary" onClick={primaryButtonAction}>
                        {primaryButtonText}
                    </button>
                    <button className="btn btn--secondary" onClick={secondaryButtonAction}>
                        {secondaryButtonText}
                    </button>
                </div>
            </div>

            <div className="activity-mystery__image">
                <img src={imageSrc} alt={alt} />
            </div>
        </section>
    );
};

export default MysteryCard;
