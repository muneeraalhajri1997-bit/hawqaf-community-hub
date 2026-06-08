import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { ImageThumb } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/news")({
  head: () => ({ meta: [{ title: "الأخبار - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="الأخبار والإعلام">
      <CrudTable
        table="news"
        orderBy="published_at"
        defaults={{ is_published: true, published_at: new Date().toISOString() }}
        listColumns={[
          { key: "image_url", label: "الصورة", render: (r) => <ImageThumb src={r.image_url} /> },
          { key: "title", label: "العنوان" },
          { key: "category", label: "التصنيف" },
          { key: "is_published", label: "ظاهر", render: (r) => (r.is_published ? "نعم" : "لا") },
          { key: "published_at", label: "تاريخ النشر", render: (r) => r.published_at ? new Date(r.published_at).toLocaleDateString("ar-SA") : "—" },
        ]}
        fields={[
          { key: "image_url", label: "الصورة الرئيسية", type: "image" },
          { key: "title", label: "العنوان", type: "text", required: true },
          { key: "excerpt", label: "ملخص قصير", type: "textarea" },
          { key: "content", label: "المحتوى", type: "textarea", required: true },
          { key: "category", label: "التصنيف", type: "select", options: [
            { value: "إعلان", label: "إعلان" },
            { value: "فعالية", label: "فعالية" },
            { value: "تقرير", label: "تقرير" },
            { value: "شراكة", label: "شراكة" },
            { value: "خبر", label: "خبر" },
          ]},
          { key: "published_at", label: "تاريخ النشر", type: "date" },
          { key: "is_published", label: "ظاهر للزوار", type: "boolean" },
        ]}
      />
    </AdminShell>
  ),
});
