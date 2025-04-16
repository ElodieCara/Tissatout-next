import LegalPageLayout from "@/components/Layout/LegalPageLayout";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "À propos | Tissatout",
    description: "Découvrez qui est derrière Tissatout et pourquoi ce site a été créé.",
};

export default function AboutPage() {
    return (
        <LegalPageLayout title="Qui suis-je ?">
            <div className="legal-body__intro">
                <div className="legal-body__image">
                    <Image
                        src="/assets/avatar-tissatout.png"
                        alt="Portrait de la créatrice de Tissatout"
                        width={200}
                        height={200}
                    />
                </div>
                <div className="legal-body__text">
                    <p>
                        Tissatout est un site indépendant, pensé et développé par une créatrice touche-à-tout,
                        passionnée par l’éducation, la pédagogie libre, la transmission et le beau.
                    </p>
                    <p>
                        Ici, pas de pub, pas de pistage, pas de compromis. Juste une envie profonde : proposer
                        aux enfants (et à leurs parents) un espace de curiosité, de jeux, de savoir, dans le
                        respect de leur intelligence.
                    </p>
                    <p>
                        J’ai tout fait à la main : le design, le code, les illustrations, les textes… C’est un
                        site artisanal, mais solide. Et j’espère qu’il vous accompagnera longtemps.
                    </p>
                </div>
            </div>
        </LegalPageLayout>
    );
}
