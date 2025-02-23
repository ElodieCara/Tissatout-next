import AdminAdviceForm from "@/app/admin/components/AdminAdviceForm";

export default function EditAdvicePage({ params }: { params: { id: string } }) {
    return <AdminAdviceForm adviceId={params.id} />;
}
