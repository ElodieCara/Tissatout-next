
import LessonHeader from "./LessonHeader";
import LessonStatusToggle from "./LessonStatusToggle";
import LessonBlock from "./LessonBlock";
import type { Lesson } from "@/types/lessons";
import ArticleFeedback from "../Feedback/Feedback";
import CommentList from "../CommentList/CommentList";
import NewsletterBanner from "../NewsletterBanner/NewsletterBanner";
import SuggestionsForParents from "../SuggestionsForParents/SuggestionsForParents";
import { getRandomSuggestions } from "@/lib/suggestions";

export default async function LessonPage({ lesson }: { lesson: Lesson }) {
    const suggestions = await getRandomSuggestions("trivium", 4);
    return (
        <article className="lesson">
            <LessonHeader
                title={lesson.title}
                slug={lesson.slug}
                chapterTitle={lesson.chapterTitle}
                ageTag={lesson.ageTag}
                image={lesson.image}
                summary={lesson.summary}
                personageName={lesson.personageName}
                personageDates={lesson.personageDates}
                personageNote={lesson.personageNote}
            />

            <div className="lesson__content">
                {/* Colonne principale */}
                <div className="lesson__main">
                    <LessonBlock
                        type="info"
                        title="Ce que nous apprend ce texte"
                        content={lesson.content}
                    />
                </div>

                {/* Colonne latérale */}
                <aside className="lesson__sidebar">
                    <LessonBlock
                        type="revision"
                        title="Révision"
                        content={lesson.revision}
                    />
                    <LessonBlock
                        type="homework"
                        title="Devoirs à faire"
                        content={lesson.homework}
                    />

                    <LessonStatusToggle slug={lesson.slug} />

                </aside>
            </div>

            {/* 💬 Et toi, qu'en as-tu pensé ? */}
            <section className="comments no-print">
                <ArticleFeedback resourceType="printable" resourceId={lesson.id} />
                <CommentList resourceType="printable" resourceId={lesson.id} />
            </section>

            <section className=" no-print">
                <NewsletterBanner />
            </section>

            <section className="no-print">
                <SuggestionsForParents items={suggestions} />
            </section>
        </article>
    );
}
