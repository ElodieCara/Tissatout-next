import AdminAdviceForm from "@/app/admin/components/AdminAdviceForm";

export default async function EditAdvicePage({ params }: { params: { id: string } }) {
    // Enveloppez params dans une promesse et attendez-la
    const { id } = await Promise.resolve(params);
    return <AdminAdviceForm adviceId={id} />;
}
