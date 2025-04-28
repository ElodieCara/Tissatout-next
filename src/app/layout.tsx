import type { Metadata } from "next";
import "@/styles/globals.scss";
import Footer from "@/layout/Footer/Footer";
import Header from "@/layout/Header/Header";

export const metadata: Metadata = {
  title: "Tissatout - Activités, conseils et inspirations pour enfants",
  description: "Explore des activités à imprimer, des conseils pratiques et des inspirations éducatives pour tous les âges.",
  openGraph: {
    title: "Tissatout - Activités, conseils et inspirations pour enfants",
    description: "Explore des activités à imprimer, des conseils pratiques et des inspirations éducatives pour tous les âges.",
    url: "https://www.tonsite.com",
    type: "website",
    images: [
      {
        url: "https://www.tonsite.com/images/default-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Tissatout - Activités pour enfants",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
