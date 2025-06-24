import "@/styles/globals.scss";
import Footer from "@/layout/Footer/Footer";
import Header from "@/layout/Header/Header";

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
