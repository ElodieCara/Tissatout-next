import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conseils | Tissatout",
    description: "Tous les conseils éducatifs de Tissatout pour accompagner les enfants dans leurs apprentissages.",
};

export default function ConseilsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
