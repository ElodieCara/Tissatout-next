import { PrintableGame } from "@/types/printable";
import { useEffect, useState } from "react";


export function usePublicActivities() {
    const [activities, setActivities] = useState<PrintableGame[]>([]);

    useEffect(() => {
        fetch("/api/printable")
            .then(res => res.json())
            .then(setActivities)
            .catch(console.error);
    }, []);

    return activities;
}

export function useAdminActivities() {
    const [activities, setActivities] = useState<PrintableGame[]>([]);

    useEffect(() => {
        fetch("/api/printable/admin")
            .then(res => res.json())
            .then(setActivities)
            .catch(console.error);
    }, []);

    return activities;
}
