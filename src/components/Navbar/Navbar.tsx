import Link from "next/link";

const menuItems = [
    { title: "Nos Univers", path: "/nos-univers" },
    { title: "Inspiration & Conseils", path: "/inspiration" },
    { title: "Coloriages à Imprimer", path: "/coloriages" },
    { title: "Jeux Ludiques", path: "/jeux-ludiques" },
    { title: "Qui sommes-nous ?", path: "/qui-sommes-nous" },
    { title: "Contact", path: "/contact" }
];

const Navbar = () => {
    return <>
        {/* Sub-masthead */}
        <div className="header__sub-masthead">
            <nav className="header__sub-masthead__nav">
                <div className="header__sub-masthead__nav__container">
                    <ul className="header__sub-masthead__nav__container__navbar">
                        {menuItems.map((item, index) => (
                            <li key={index} className="header__sub-masthead__nav__container__navbar-menu">
                                <Link href={item.path}>{item.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    </>;
};
export default Navbar;