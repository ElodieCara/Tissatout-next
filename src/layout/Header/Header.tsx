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
    const router = useRouter();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // bloque l'envoi classique du formulaire
        if (search.trim()) {
            router.push(`/recherche?query=${encodeURIComponent(search.trim())}`);
            setSearch("");
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMenuOpen(false); // ferme le menu mobile automatiquement
            }
        };

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
                    <div className="header__masthead__nav-main__actions">
                        <form
                            className="header__masthead__nav-main__input"
                            onSubmit={handleSearchSubmit}
                        >
                            <input type="text"
                                name="search"
                                placeholder="Rechercher"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" aria-label="Rechercher">
                                <FaMagnifyingGlass size={20} />
                            </button>
                        </form>

                        {/* Bouton Hamburger */}
                        <button
                            className="header__masthead__nav-main__hamburger"
                            onClick={onSidebarToggle || toggleMenu} // ✅ Ici on utilise la prop si dispo
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
