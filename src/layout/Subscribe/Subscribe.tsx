import Link from "next/link";
import React from "react";


const Subscribe: React.FC = () => {
    return (
        <section className="container__subscribe">
            <div className="container__subscribe__link">
                {[...Array(2)].map((_, idx) => (
                    <React.Fragment key={idx}>
                        <div className="container__subscribe__link--square"></div>
                        <hr className="container__subscribe__link__line" />
                    </React.Fragment>
                ))}

                <Link href="/subscribe" className="container__subscribe__link--subscribe-button">
                    <div className="container__subscribe__link--square"></div>
                    <span className="container__subscribe__link--text">Subscribe</span>
                </Link>

                {[...Array(2)].map((_, idx) => (
                    <React.Fragment key={idx}>
                        <hr className="container__subscribe__link__line" />
                        <div className="container__subscribe__link--square"></div>
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default Subscribe;
