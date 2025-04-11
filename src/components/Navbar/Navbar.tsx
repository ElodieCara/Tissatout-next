import Link from "next/link";

const menuItems = [
    {
        title: "Nos Univers",
        path: "/nos-univers",
        submenu: {
            age: [
                { title: "3 ans", path: "/nos-univers/3-ans" },
                { title: "6 ans", path: "/nos-univers/6-ans" },
                { title: "10 ans", path: "/nos-univers/10-ans" }
            ],
            theme: [
                { title: "Trivium", path: "/trivium" },
                { title: "Quadrivium", path: "/quadrivium" }
            ]
        }
    }, { title: "Inspiration & Conseils", path: "/inspiration" },
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
                            <li key={index} className={[
                                "header__sub-masthead__nav__container__navbar-menu",
                                item.submenu && "dropdown"
                            ].filter(Boolean).join(" ")}
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
    </>;
};
export default Navbar;