import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { ImageThumb } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/programs")({
  head: () => ({ meta: [{ title: "البرامج - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="البرامج">
      <CrudTable
        table="programs"
        orderBy="created_at"
        defaults={{ status: "active" }}
        listColumns={[
          { key: "image_url", label: "الصورة", render: (r) => <ImageThumb src={r.image_url} /> },
          { key: "title", label: "العنوان" },
          { key: "category", label: "التصنيف" },
          { key: "status", label: "الحالة" },
        ]}
        fields={[
          { key: "image_url", label: "صورة البرنامج", type: "image" },
          { key: "title", label: "العنوان", type: "text", required: true },
          { key: "description", label: "الوصف", type: "textarea", required: true },
          { key: "category", label: "التصنيف", type: "text" },
          { key: "icon", label: "الأيقونة", type: "text" },
          { key: "status", label: "الحالة", type: "select", options: [
            { value: "active", label: "نشط" },
            { value: "draft", label: "مسودة" },
            { value: "completed", label: "مكتمل" },
          ]},
        ]}
      />
    </AdminShell>
  ),
});
