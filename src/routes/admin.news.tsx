import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/news")({
  head: () => ({ meta: [{ title: "الأخبار - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="الأخبار والإعلام">
      <CrudTable
        table="news"
        orderBy="created_at"
        defaults={{ is_published: false }}
        listColumns={[
          { key: "title", label: "العنوان" },
          { key: "category", label: "التصنيف" },
          { key: "is_published", label: "منشور", render: (r) => (r.is_published ? "نعم" : "لا") },
          { key: "published_at", label: "تاريخ النشر" },
        ]}
        fields={[
          { key: "title", label: "العنوان", type: "text", required: true },
          { key: "excerpt", label: "ملخص قصير", type: "textarea" },
          { key: "content", label: "المحتوى", type: "textarea", required: true },
          { key: "image_url", label: "رابط الصورة", type: "text" },
          { key: "category", label: "التصنيف", type: "text" },
          { key: "is_published", label: "منشور", type: "boolean" },
          { key: "published_at", label: "تاريخ النشر (ISO)", type: "text", placeholder: "2026-06-04T12:00:00Z" },
        ]}
      />
    </AdminShell>
  ),
});
