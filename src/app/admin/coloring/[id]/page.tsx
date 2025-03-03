import AdminColoringForm from "@/app/admin/components/AdminColoringForm";

export default function EditColoringPage({ params }: { params: { id: string } }) {
    return <AdminColoringForm coloringId={params.id} />;
}
