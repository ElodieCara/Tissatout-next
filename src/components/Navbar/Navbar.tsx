"use client";

import Link from "next/link";

interface NavbarProps {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

const menuItems = [
    {
        title: "Nos Univers",
        path: "/nos-univers",
        submenu: {
            age: [
                { title: "Tout-petits", path: "/nos-univers/tout-petits" },
                { title: "3 ans", path: "/nos-univers/des-3-ans" },
                { title: "6 ans", path: "/nos-univers/des-6-ans" },
                { title: "10 ans", path: "/nos-univers/des-10-ans" },
            ],
            theme: [
                { title: "Trivium", path: "/trivium" },
                { title: "Quadrivium", path: "/quadrivium" },
            ],
        },
    },
    { title: "Inspiration & Conseils", path: "/inspiration" },
    { title: "Coloriages à Imprimer", path: "/coloriages" },
    { title: "Activités à imprimer", path: "/activites-a-imprimer" },
    { title: "Qui suis-je ?", path: "/a-propos" },
    { title: "Contact", path: "/contact" },
];

const Navbar = ({ menuOpen, setMenuOpen }: NavbarProps) => {
    return (
        <>
            {/* Desktop Navigation */}
            <div className="header__sub-masthead desktop-only">
                <nav className="header__sub-masthead__nav">
                    <div className="header__sub-masthead__nav__container">
                        <ul className="header__sub-masthead__nav__container__navbar">
                            {menuItems.map((item, index) => (
                                <li
                                    key={index}
                                    className={[
                                        "header__sub-masthead__nav__container__navbar-menu",
                                        item.submenu && "dropdown",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                >
                                    <Link href={item.path}>{item.title}</Link>
                                    {item.submenu && (
                                        <div className="dropdown__mega">
                                            <div className="dropdown__group">
                                                <p className="dropdown__group-title">Par Âge</p>
                                                <ul>
                                                    {item.submenu.age.map((subItem, i) => (
                                                        <li key={i}>
                                                            <Link href={subItem.path}>{subItem.title}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="dropdown__group">
                                                <p className="dropdown__group-title">Par Thème</p>
                                                <ul>
                                                    {item.submenu.theme.map((subItem, i) => (
                                                        <li key={i}>
                                                            <Link href={subItem.path}>{subItem.title}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Mobile Navigation */}
            {menuOpen && (
                <div className="header__mobile-menu mobile-only">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link href={item.path} onClick={() => setMenuOpen(false)}>
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </>
    );
};

export default Navbar;
