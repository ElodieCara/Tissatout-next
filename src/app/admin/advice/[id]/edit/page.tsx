import AdminAdviceForm from "@/app/admin/components/AdminAdviceForm";

export default async function EditAdvicePage({ params }: { params: { id: string } }) {
    const { id } = await params; // ✅ Déstructuration simple
    return <AdminAdviceForm adviceId={id} />;
}
