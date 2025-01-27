"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import SummerDecorations from "@/components/Decorations/Themes/Summer/Summer";
import WinterDecorations from "@/components/Decorations/Themes/Winter/Winter";
import HalloweenDecorations from "@/components/Decorations/Themes/Halloween/Halloween";
import ChristmasDecorations from "@/components/Decorations/Themes/Christmas/Christmas";
import SpringDecorations from "./Spring/Spring";
import AutumnDecorations from "./Autumn/Autumn";
import { Theme } from "@/types/theme";
import BackToSchoolDecorations from "./Back_to_school/BackToSchool";
import { calculateEaster } from "@/utils/dateHelpers";
import ThemeDecorations from "@/components/Decorations/Themes/ThemeDecorations";
import { decorationsConfig } from "@/data/decorationsConfig";


const themes: Record<Theme, string> = {
    "back-to-school-theme": "back-to-school-theme",
    "easter-theme": "easter-theme",
    "default-theme": "default-theme",
    "summer-theme": "summer-theme",
    "winter-theme": "winter-theme",
    "spring-theme": "spring-theme",
    "autumn-theme": "autumn-theme",
    "halloween-theme": "halloween-theme",
    "christmas-theme": "christmas-theme",
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

        if (forceTheme !== null) return;

        const now = new Date();
        const month = now.getMonth();
        const day = now.getDate();

        // Une semaine avant Pâques
        const easterWeekStart = new Date(easterDate);
        easterWeekStart.setDate(easterDate.getDate() - 7);

        if (now >= easterWeekStart && now <= easterDate) {
            setTheme("easter-theme"); // Thème appliqué pour Pâques
        } else if (month === 11 && day >= 20) {
            setTheme("christmas-theme");
        } else if (month === 10 && day >= 25) {
            setTheme("halloween-theme");
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
        // Appliquer la classe CSS du thème sur <body>
        document.body.className = `${themeToApply}-theme`;
    }, [themeToApply]);


    useEffect(() => {
        console.log("forceTheme:", forceTheme);
        console.log("theme (auto):", theme);
        console.log("themeToApply (appliqué):", themeToApply);
    }, [forceTheme, theme, themeToApply]);

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTheme = e.target.value;
        setForceTheme(selectedTheme === "auto" ? null : (selectedTheme as Theme));
    };

    return (
        <ThemeContext.Provider value={{ theme: themeToApply, setForceTheme }}>
            <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 999 }}>
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

            <ThemeDecorations
                decorations={decorationsConfig[themeToApply] || []} // Toujours renvoyer un tableau vide
                theme={themeToApply}
            />

            {/* {themeToApply === "back-to-school-theme" && <BackToSchoolDecorations />}
            {themeToApply === "summer-theme" && <SummerDecorations />}
            {themeToApply === "winter-theme" && <WinterDecorations />}
            {themeToApply === "spring-theme" && <SpringDecorations />}
            {themeToApply === "autumn-theme" && <AutumnDecorations />}
            {themeToApply === "halloween-theme" && <HalloweenDecorations />}
            {themeToApply === "christmas-theme" && <ChristmasDecorations />} */}
            <div key={themeToApply}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
