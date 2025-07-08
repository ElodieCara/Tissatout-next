"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaMagnifyingGlass, FaBars } from "react-icons/fa6";
import Navbar from "@/components/Navbar/Navbar";

type HeaderProps = {
    onSidebarToggle?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/recherche?query=${encodeURIComponent(search.trim())}`);
            setSearch("");
            setSearchExpanded(false);
        }
    };

    const handleSearchToggle = () => {
        if (isMobile) {
            setSearchExpanded(!searchExpanded);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);

            if (window.innerWidth >= 768) {
                setMenuOpen(false);
            }

            if (!mobile) {
                setSearchExpanded(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <header>
            {/* Masthead */}
            <div className="header__masthead">
                <nav className="header__masthead__nav-main">
                    <div className="header__masthead__nav-main__logo"
                        style={{ position: "relative", width: "115px", height: "100px" }}>
                        <Link href="/">
                            <Image
                                src="/Tissatout.png"
                                alt="Logo Tissatout"
                                width={130}
                                height={80}
                                style={{ objectFit: "contain" }}
                                loading="eager"
                            />
                        </Link>
                    </div>

                    {/* Recherche + Hamburger */}
                    <div className="header__masthead__nav-main__actions" style={{ position: 'relative' }}>
                        {/* Barre de recherche mobile étendue */}
                        {isMobile && searchExpanded && (
                            <div className="mobile-search-expanded">
                                <form onSubmit={handleSearchSubmit} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    width: '100%'
                                }}>
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="Rechercher"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        autoFocus
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            padding: '8px 12px',
                                            fontSize: '0.95rem',
                                            borderRadius: '20px',
                                            color: '#333',
                                            backgroundColor: 'white',
                                            flex: 1
                                        }}
                                    />
                                    <button type="submit" aria-label="Rechercher" style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        padding: '8px'
                                    }}>
                                        <FaMagnifyingGlass size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSearchExpanded(false)}
                                        aria-label="Fermer la recherche"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'white',
                                            cursor: 'pointer',
                                            padding: '8px'
                                        }}
                                    >
                                        {/* //<FaTimes size={16} /> */}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Barre de recherche normale (desktop) ou bouton rond (mobile) */}
                        {!(isMobile && searchExpanded) && (
                            <form
                                className="header__masthead__nav-main__input"
                                onSubmit={isMobile ? (e) => e.preventDefault() : handleSearchSubmit}
                            >
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Rechercher"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button
                                    type={isMobile ? "button" : "submit"}
                                    onClick={isMobile ? handleSearchToggle : undefined}
                                    aria-label="Rechercher"
                                >
                                    <FaMagnifyingGlass size={20} />
                                </button>
                            </form>
                        )}

                        {/* Bouton Hamburger */}
                        <button
                            className="header__masthead__nav-main__hamburger"
                            onClick={onSidebarToggle || toggleMenu}
                            aria-label="Ouvrir/fermer le menu"
                        >
                            <FaBars size={24} />
                        </button>
                    </div>
                </nav>
            </div>

            {/* Nav */}
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </header>
    );
};

export default Header;