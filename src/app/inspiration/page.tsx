import { getInspirationData } from "@/lib/server";
import InspirationPage from "./InspirationPage"; // 👈 Import du Client Component

export default async function Page() {
    const { articles, ideas, advices } = await getInspirationData();

    return <InspirationPage articles={articles} ideas={ideas} advices={advices} />;
}
