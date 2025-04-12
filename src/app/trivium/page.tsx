import { getTriviumLessons } from "@/lib/lessons";
import TriviumPage from "./TriviumPage";

export default async function Page() {
    const lessons = await getTriviumLessons();
    return <TriviumPage lessons={lessons} />;
}
