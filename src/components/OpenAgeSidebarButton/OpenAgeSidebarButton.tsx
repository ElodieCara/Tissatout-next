"use client";

import { useState } from "react";
import SidebarAgeMobile from "@/components/SidebarAgeMobile/SidebarAgeMobile";

export default function OpenAgeSidebarButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="sidebar-age__section">
                <button onClick={() => setIsOpen(true)} className="sidebar-age__button">
                    Ouvrir les catégories
                    <span className="icon">⋮</span>
                </button>
            </div>

            <SidebarAgeMobile isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
