import { FaFacebook, FaPinterest } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import Link from "next/link";

const Footer: React.FC = () => {
    return (
        <footer className="container__footer">
            {/* Réseaux sociaux */}
            <div className="container__footer__social">
                <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebook size={30} />
                </Link>
                <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={30} />
                </Link>
                <Link href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
                    <FaPinterest size={30} />
                </Link>
            </div>

            {/* Section légale */}
            <div className="container__footer__legacy">
                <p>© 2025 Tissatout. Tous droits réservés.</p>
                <p>
                    <Link href="/cookies">Cookies</Link> |{" "}
                    <Link href="/charte-utilisateur">Charte utilisateur</Link> |{" "}
                    <Link href="/mentions-legales">Mentions légales</Link>
                </p>
            </div>

            {/* Informations et navigation */}
            <div className="container__footer__information">
                <div className="container__footer__information__navigation">
                    {/* Liens Utiles */}
                    <ul className="container__footer__information__navigation--liens">
                        <h3>Liens Utiles</h3>
                        <li>
                            <Link href="/contact">Contact</Link>
                        </li>
                        <li>
                            <Link href="/confidentialite">Politique de confidentialité</Link>
                        </li>
                        <li>
                            <Link href="/a-propos">Qui sommes-nous ?</Link>
                        </li>
                    </ul>

                    {/* Informations */}
                    <ul className="container__footer__information__navigation--liens">
                        <h3>Informations</h3>
                        <li>
                            <Link href="/blog">Blog</Link>
                        </li>
                        <li>
                            <Link href="/partenaires">Partenaires</Link>
                        </li>
                        <li>
                            <Link href="/temoignages">Témoignages</Link>
                        </li>
                    </ul>

                    {/* Avec Vous */}
                    <ul className="container__footer__information__navigation--liens">
                        <h3>Avec vous !</h3>
                        <li>
                            <Link href="/feedback">Remarques ?</Link>
                        </li>
                        <li>
                            <Link href="/ideas">Vos idées !</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
