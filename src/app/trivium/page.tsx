import TriviumPage from "./TriviumPage";
import { getTriviumLessons, getTriviumCollections } from "@/lib/lessons";

export default async function Page() {
    const lessons = await getTriviumLessons();
    const collections = await getTriviumCollections();

    return <TriviumPage lessons={lessons} collections={collections} />;
}
