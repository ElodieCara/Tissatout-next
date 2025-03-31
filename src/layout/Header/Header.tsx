"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaPinterest } from "react-icons/fa";
import { FaXTwitter, FaMagnifyingGlass } from "react-icons/fa6";
import Navbar from "@/components/Navbar/Navbar";

const Header: React.FC = () => {
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);

    return (
        <header>
            {/* Masthead */}
            <div className="header__masthead">
                <div className="header__masthead__social">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook size={18} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaXTwitter size={18} />
                    </a>
                    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                        <FaPinterest size={18} />
                    </a>
                </div>
                <nav className="header__masthead__nav-main">
                    <div className="header__masthead__nav-main__logo" style={{ position: "relative", width: "180px", height: "100px" }}>
                        <Link href="/">
                            <Image
                                src="/Tissatout.png"
                                alt="Logo Tissatout"
                                width={130}
                                height={80}
                                style={{ objectFit: "contain" }} // Garde les proportions
                            />
                        </Link>
                    </div>

                    {/* <h1 className="header__masthead__nav-main__title">Tissatout</h1> */}

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
            <Navbar />
        </header>
    );
};

export default Header;
