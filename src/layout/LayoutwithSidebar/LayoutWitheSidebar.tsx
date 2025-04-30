// // layout/LayoutWithSidebar.tsx
// "use client";

// import { useEffect, useState } from "react";
// import Header from "@/layout/Header/Header";
// import Footer from "@/layout/Footer/Footer";
// import CookieBanner from "@/components/CookieBanner/CookieBanner";
// import Sidebar from "@/components/Sidebar/Sidebar";
// import SidebarMobile from "@/components/SidebarAgeMobile/SidebarAgeMobile";

// export default function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
//     const [isMobile, setIsMobile] = useState(false);
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//     useEffect(() => {
//         const checkMobile = () => setIsMobile(window.innerWidth <= 768);
//         checkMobile();
//         window.addEventListener("resize", checkMobile);
//         return () => window.removeEventListener("resize", checkMobile);
//     }, []);

//     return (
//         <>
//             <Header onSidebarToggle={() => setIsSidebarOpen(true)} />

//             {/* Mobile sidebar version */}
//             {isMobile && isSidebarOpen && (
//                 <div className="sidebar__overlay">
//                     <nav className="sidebar__panel">
//                         <button className="sidebar__close" onClick={() => setIsSidebarOpen(false)}>✖</button>
//                         <ul className="sidebar__list">
//                             <li className="sidebar__item"><a href="/univers">Nos univers</a></li>
//                             <li className="sidebar__item"><a href="/conseils">Inspiration & Conseils</a></li>
//                             <li className="sidebar__item"><a href="/coloriages">Coloriages à imprimer</a></li>
//                             <li className="sidebar__item"><a href="/activites">Activités à imprimer</a></li>
//                             <li className="sidebar__item"><a href="/qui-suis-je">Qui suis-je ?</a></li>
//                             <li className="sidebar__item"><a href="/contact">Contact</a></li>
//                         </ul>
//                     </nav>
//                 </div>
//             )}

//             {/* Desktop sidebar */}
//             {!isMobile && <Sidebar categories={{}} />}


//             {/*
//             {isMobile ? (
//                 <SidebarMobile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
//             ) : (
//                 <Sidebar categories={{}} />
//             )} */}
//             <main>
//                 {children}
//                 <CookieBanner />
//             </main>
//             <Footer />
//         </>
//     );
// }
