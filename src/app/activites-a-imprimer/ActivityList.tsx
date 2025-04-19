"use client";

import { useState } from "react";
import type { PrintableGame } from "@prisma/client";
import ActivityCard from "../../components/ActivityCard/ActivityCard";

export default function ActivityList({ initialActivities }: { initialActivities: PrintableGame[] }) {
    const [activities, setActivities] = useState(initialActivities);

    return (
        <section className="activity-list">
            {activities.map((activity) => (
                <ActivityCard
                    key={activity.id}
                    title={activity.title}
                    imageUrl={activity.imageUrl}
                    ageMin={activity.ageMin}
                    ageMax={activity.ageMax}
                    pdfUrl={activity.pdfUrl}
                    isPrintable={activity.isPrintable}
                />
            ))}
        </section>
    );
}
