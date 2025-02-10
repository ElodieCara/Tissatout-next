import AdminIdeaForm from "../../components/AdminIdeaForm";

export default function EditIdeaPage({ params }: { params: { id: string } }) {
    const { id } = params; // Récupère l'ID depuis l'URL

    return (
        <div className="admin__section">
            <AdminIdeaForm ideaId={id} />
        </div>
    );
}
