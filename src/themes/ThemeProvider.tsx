"use client";

import { useEffect, useState } from "react";
import SummerDecorations from "@/components/Decorations/Summer";
import WinterDecorations from "@/components/Decorations/Winter";
import HalloweenDecorations from "@/components/Decorations/Halloween";
import ChristmasDecorations from "@/components/Decorations/Christmas";

const themes = {
    default: "default-theme",
    summer: "summer-theme",
    winter: "winter-theme",
    halloween: "halloween-theme",
    christmas: "christmas-theme",
};

const ThemeProvider: React.FC = () => {
    const [theme, setTheme] = useState("default-theme");
    const [forceTheme, setForceTheme] = useState<string | null>(null);

    const themeToApply = forceTheme || theme;

    useEffect(() => {
        if (forceTheme) return;

        const now = new Date();
        const month = now.getMonth();
        const day = now.getDate();

        if (month === 11 && day >= 20) {
            setTheme(themes.christmas);
        } else if (month === 10 && day >= 25) {
            setTheme(themes.halloween);
        } else if (month >= 5 && month <= 7) {
            setTheme(themes.summer);
        } else if (month >= 0 && month <= 1) {
            setTheme(themes.winter);
        } else {
            setTheme(themes.default);
        }
    }, [forceTheme]);

    useEffect(() => {
        document.body.className = themeToApply;
    }, [themeToApply]);

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTheme = e.target.value;
        setForceTheme(selectedTheme === "auto" ? null : selectedTheme);
    };

    return (
        <>
            <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 999 }}>
                <label htmlFor="theme-selector" style={{ marginRight: "10px", color: "white" }}>
                    Tester les thèmes :
                </label>
                <select id="theme-selector" onChange={handleThemeChange}>
                    <option value="auto">Automatique</option>
                    {Object.entries(themes).map(([key, value]) => (
                        <option key={key} value={value}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {themeToApply === themes.summer && <SummerDecorations />}
            {themeToApply === themes.winter && <WinterDecorations />}
            {themeToApply === themes.halloween && <HalloweenDecorations />}
            {themeToApply === themes.christmas && <ChristmasDecorations />}
        </>
    );
};

export default ThemeProvider;
