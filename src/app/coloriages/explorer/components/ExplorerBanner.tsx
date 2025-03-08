import React from "react";

interface ExplorerBannerProps {
    imageUrl: string;
    title: string;
    description: string;
    onClick?: () => void;
}

const ExplorerBanner: React.FC<ExplorerBannerProps> = ({ imageUrl, title, description, onClick }) => {
    return (
        <div className="explorer-banner">
            <img src={imageUrl} alt="Bannière" className="explorer-banner__image" />
            <div className="explorer-banner__content">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            {/* 🔍 Moteur de recherche */}
            <div className="search-bar">
                <input type="text" placeholder="🔍 Rechercher un coloriage..." />
            </div>
        </div>
    );
};

export default ExplorerBanner;
