import AdminPrintableForm from "../../components/AdminPrintableGamesForm";

export default async function AdminPrintableFormPage({
    params,
}: {
    params: { gameId: string };
}) {
    // ⚠️ await avant d’extraire gameId
    const { gameId } = params;

    return <AdminPrintableForm gameId={gameId} />;
}
