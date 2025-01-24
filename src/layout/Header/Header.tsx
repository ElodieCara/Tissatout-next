"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaPinterest } from "react-icons/fa";
import { FaXTwitter, FaMagnifyingGlass } from "react-icons/fa6";

const Header: React.FC = () => {
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);

    return (
        <header>
            {/* Masthead */}
            <div className="header__masthead">
                <div className="header__masthead__social">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook size={30} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaXTwitter size={30} />
                    </a>
                    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                        <FaPinterest size={30} />
                    </a>
                </div>
                <nav className="header__masthead__nav-main">
                    <div className="header__masthead__nav-main__logo">
                        <Image
                            src="/Tissatout.png" // L'image doit être dans le dossier "public"
                            width={180}
                            height={50}
                            alt="Logo Tissatout"
                        />
                    </div>
                    <h1 className="header__masthead__nav-main__title">Tissatout</h1>
                    <form
                        className="header__masthead__nav-main__input"
                        action="#"
                        method="get"
                    >
                        <input type="text" name="search" placeholder="Rechercher" />
                        <button type="submit">
                            <FaMagnifyingGlass size={20} />
                        </button>
                    </form>
                </nav>
            </div>
            {/* Sub-masthead */}
            <div className="header__sub-masthead">
                <nav className="header__sub-masthead__nav">
                    <div className="header__sub-masthead__nav__container">
                        <ul className="header__sub-masthead__nav__container__navbar">
                            {["Accueil", "Articles", "Coloriages", "Jeux", "À propos", "Contact"].map(
                                (title, index) => (
                                    <li
                                        key={index}
                                        className="header__sub-masthead__nav__container__navbar-menu"
                                    >
                                        <Link href={`/${title.toLowerCase()}`} legacyBehavior>
                                            <a onClick={handleClick}>{title}</a>
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </nav>

            </div>
        </header>
    );
};

export default Header;
