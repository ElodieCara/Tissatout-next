"use client";

import { createContext, useContext, useState } from "react";

interface GlobalLoadingContextType {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export const useGlobalLoading = () => {
    const context = useContext(GlobalLoadingContext);
    if (!context) throw new Error("useGlobalLoading must be used inside GlobalLoadingProvider");
    return context;
};

export const GlobalLoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setLoading] = useState(false);
    return (
        <GlobalLoadingContext.Provider value={{ isLoading, setLoading }}>
            {children}
        </GlobalLoadingContext.Provider>
    );
};
