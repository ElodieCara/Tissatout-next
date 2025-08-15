"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { Theme } from "@/types/theme";
import { calculateEaster } from "@/utils/dateHelpers";
import ThemeDecorations from "@/components/Decorations/Themes/ThemeDecorations";

const themes: Record<Theme, string> = {
    "back-to-school-theme": "back-to-school-theme",
    "easter-theme": "easter-theme",
    "default-theme": "default-theme",
    "summer-theme": "summer-theme",
    "winter-theme": "winter-theme",
    "spring-theme": "spring-theme",
    "autumn-theme": "autumn-theme",
    "christmas-theme": "christmas-theme",
    "toussaint-theme": "toussaint-theme",
    "chandeleur-theme": "chandeleur-theme",
    "saint-jean-theme": "saint-jean-theme",
    "epiphanie-theme": "epiphanie-theme"
};

interface ThemeContextType {
    theme: Theme;
    setForceTheme: (theme: Theme | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

const ThemeProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>("default-theme");
    const [forceTheme, setForceTheme] = useState<Theme | null>(null);

    const themeToApply = forceTheme || theme;

    useEffect(() => {
        const year = new Date().getFullYear();
        const easterDate = calculateEaster(year);

        const toussaint = new Date(year, 10 - 1, 1);      // 1er novembre
        const chandeleur = new Date(year, 2 - 1, 2);      // 2 février
        const epiphanie = new Date(year, 0, 6);           // 6 janvier
        const saintJean = new Date(year, 5, 24);          // 24 juin

        if (forceTheme !== null) return;

        const now = new Date();
        const month = now.getMonth();
        const day = now.getDate();

        const easterWeekStart = new Date(easterDate);
        easterWeekStart.setDate(easterDate.getDate() - 7);

        if (now >= easterWeekStart && now <= easterDate) {
            setTheme("easter-theme");
        } else if (now.toDateString() === epiphanie.toDateString()) {
            setTheme("epiphanie-theme");
        } else if (now.toDateString() === chandeleur.toDateString()) {
            setTheme("chandeleur-theme");
        } else if (now.toDateString() === saintJean.toDateString()) {
            setTheme("saint-jean-theme");
        } else if (now.toDateString() === toussaint.toDateString()) {
            setTheme("toussaint-theme");
        } else if (month === 11 && day >= 20) {
            setTheme("christmas-theme");
        } else if ((month === 8 && day >= 20) || (month === 9 && day <= 15)) {
            setTheme("back-to-school-theme");
        } else if (month >= 5 && month <= 7) {
            setTheme("summer-theme");
        } else if (month >= 2 && month <= 4) {
            setTheme("spring-theme");
        } else if (month >= 8 && month <= 10) {
            setTheme("autumn-theme");
        } else if (month === 0 || month === 1 || (month === 11 && day < 20)) {
            setTheme("winter-theme");
        } else {
            setTheme("default-theme");
        }
    }, [forceTheme]);

    useEffect(() => {
        document.body.className = `${themeToApply}`;
    }, [themeToApply]);

    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.log("forceTheme:", forceTheme);
            console.log("theme (auto):", theme);
            console.log("themeToApply (appliqué):", themeToApply);
        }
    }, [forceTheme, theme, themeToApply]);

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTheme = e.target.value;
        setForceTheme(selectedTheme === "auto" ? null : (selectedTheme as Theme));
    };

    return (
        <ThemeContext.Provider value={{ theme: themeToApply, setForceTheme }}>
            {process.env.NODE_ENV === "development" && (
                <div style={{ position: "fixed", top: "10px", right: "5px", zIndex: 999 }}>
                    <label htmlFor="theme-selector" style={{ marginRight: "10px", color: "white" }}>
                        Tester les thèmes :
                    </label>
                    <select id="theme-selector" onChange={handleThemeChange} value={forceTheme || "auto"}>
                        <option value="auto">Automatique</option>
                        {Object.keys(themes).map((key) => (
                            <option key={key} value={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <ThemeDecorations theme={themeToApply} />

            <div key={themeToApply}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
