import AdminArticleForm from "@/app/admin/components/AdminArticleForm";

type PageProps = {
    params: {
        id: string;
    };
};

export default function ArticleEditPage({ params }: { params: { id: string } }) {
    return <AdminArticleForm articleId={params.id} />;
}
