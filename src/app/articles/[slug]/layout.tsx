export default function ArticleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}


//✅ (pour débloquer l'accès à params.slug)
// Dans Next 14, les params dans les routes dynamiques ([slug])
// ne sont pas immédiatement disponibles
// si tu ne passes pas par un layout.tsx dans le segment parent.