import React from "react";

interface ExplorerBannerProps {

    title: string;
    description: string;
    onClick?: () => void;
}

const ExplorerBanner: React.FC<ExplorerBannerProps> = ({ title, description, onClick }) => {
    return (
        <div className="explorer-banner">
            <div className="explorer-banner__content">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            {/* 🔍 Moteur de recherche */}
            {/* <div className="search-bar">
                <input type="text" placeholder="🔍 Rechercher un coloriage..." />
            </div> */}
        </div>
    );
};

export default ExplorerBanner;
