"use client";

import Button from "@/components/Button/Button";

export default function LessonActions() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="lesson__actions">
            <Button onClick={handlePrint} variant="yellow-button">
                Fiche à imprimer
            </Button>
        </div>
    );
}
