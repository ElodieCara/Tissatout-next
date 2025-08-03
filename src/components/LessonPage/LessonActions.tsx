"use client";

import Button from "@/components/Button/Button";

export default function LessonActions({ slug }: { slug: string }) {

    const handlePrint = () => {
        const body = document.body;

        window.print();
    };

    return (
        <div className="lesson__actions">
            <Button onClick={handlePrint} variant="yellow-button">
                Fiche à imprimer
            </Button>
            {/* <Button href={`/quiz/${slug}`} variant="yellow-button">
                Faire le quiz
            </Button> */}
            {/* <Button href={`/illustrations/${slug}`} variant="yellow-button">
                Voir l’image
            </Button> */}
        </div>
    );
}

