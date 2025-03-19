import AdminArticleForm from "@/app/admin/components/AdminArticleForm";

export default function ArticleEditPage({ params }: { params: { id: string } }) {
    return <AdminArticleForm articleId={params.id} />;
}
