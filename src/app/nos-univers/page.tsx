import Link from "next/link";
import Image from "next/image";
import { sections } from "@/data/home"; // Importe tes tranches d’âge

export default function NosUniversPage() {
    return (
        <div>
            <h1>Nos Univers ✨</h1>
            <p>Découvrez nos activités classées par âge.</p>

            <div className="categories">
                {sections.map((section) => (
                    <Link key={section.title} href={`/nos-univers/${encodeURIComponent(section.title)}`} className="category-card">
                        <Image src={section.imageCard.src} alt={section.title} width={200} height={150} />
                        <h3>{section.title}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
}
