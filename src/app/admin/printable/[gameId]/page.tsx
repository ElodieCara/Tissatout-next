import AdminPrintableForm from "../../components/AdminPrintableGamesForm";

export default function AdminPrintableFormPage({ params }: { params: { gameId: string } }) {
    return <AdminPrintableForm gameId={params.gameId} />;
}
