'use client';
import { useState } from 'react';

export default function Quickbar() {
    const [sheetOpen, setSheetOpen] = useState(false);

    // Définissez vos items ; la clé servira de suffixe de classe
    const items = [
        { id: 'articles', icon: '/icons/titres/livre.png', bg: '#F78E74', label: 'Articles', text: '#FFFFFF' },
        { id: 'conseils', icon: '/icons/titres/loupe.png', bg: '#316470', label: 'Conseils', text: '#FFFFFF' },
        { id: 'coloriages', icon: '/icons/titres/coloriages.png', bg: '#76A597', label: 'Coloriages', text: '#FFFFFF' },
        { id: 'idees', icon: '/icons/titres/cible.png', bg: '#FDCA57', label: 'Idées', text: '#FFFFFF' },
    ];

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setSheetOpen(false);
    };
    // Style inline minimal pour le bouton carré
    const buttonStyleBase: React.CSSProperties = {
        border: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '4px 0',
        width: '100%',
        textAlign: 'center',
    };

    // Style inline pour la barre qui s’affiche sur mobile
    const sheetStyle: React.CSSProperties = {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        background: '#ffffff',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.2)',
        padding: '16px',
        display: sheetOpen ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1000,
    };

    return (
        <>
            {/* Barre fixe tablette+ */}
            <nav className="quicknav" role="navigation">
                {items.map(({ id, icon, label }) => (
                    <button
                        key={id}
                        className={`quicknav__item quicknav__item--${id}`}
                        onClick={() => scrollToSection(id)}
                    >
                        <img src={icon} alt={label} className="quicknav__icon" />
                        <span className="quicknav__label">{label}</span>
                    </button>
                ))}
            </nav>

            {/* Floating Action Button mobile */}
            <button
                className="fab"
                aria-label="Ouvrir le menu"
                onClick={() => setSheetOpen(o => !o)}
            >
                +
            </button>

            {/* Bottom sheet mobile, apparaît quand sheetOpen=true */}
            <div className="sheet" style={sheetStyle}>
                {items.map(({ id, icon, label, bg, text }) => (
                    <button
                        key={id}
                        className="sheet__item"
                        onClick={() => scrollToSection(id)}
                        style={{
                            ...buttonStyleBase,
                            backgroundColor: bg,
                            color: text,
                            border: `2px solid ${bg}`,
                        }}
                    >
                        <img src={icon} alt={label} style={{ width: '24px', height: '24px', marginBottom: '4px' }} />
                        <span style={{ fontSize: '1rem' }}>{label}</span>
                    </button>
                ))}
            </div>
        </>
    );
}
