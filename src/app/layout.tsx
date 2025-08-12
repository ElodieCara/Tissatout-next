import "@/styles/globals.scss";
import Footer from "@/layout/Footer/Footer";
import Header from "@/layout/Header/Header";
import type { Metadata } from "next";
import { headers } from "next/headers";

// ✅ Fixe metadataBase dynamiquement (dev/preview/prod)
export async function generateMetadata(): Promise<Metadata> {
  const envBase =
    process.env.BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  let metadataBase: URL;

  if (envBase) {
    metadataBase = new URL(envBase);
  } else {
    // Fallback depuis les headers (utile en dev)
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    metadataBase = new URL(`${proto}://${host}`);
  }

  return {
    metadataBase,
    title: { default: "Tissatout", template: "%s • Tissatout" },
    description: "Description par défaut de Tissatout",
    openGraph: {
      siteName: "Tissatout",
      type: "website",
      images: [{ url: "/og-image.jpg" }]
    },
    twitter: {
      card: "summary_large_image",
      site: "@tissatout"
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Nerko+One&family=Schoolbell&family=Homemade+Apple&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}