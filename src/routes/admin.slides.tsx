import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { ImageThumb } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/slides")({
  head: () => ({ meta: [{ title: "السلايدر - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="سلايدر الصفحة الرئيسية">
      <CrudTable
        table="slides"
        orderBy="order_index"
        ascending
        defaults={{ order_index: 0 }}
        listColumns={[
          { key: "image_url", label: "الصورة", render: (r) => <ImageThumb src={r.image_url} /> },
          { key: "order_index", label: "الترتيب" },
          { key: "title", label: "العنوان" },
        ]}
        fields={[
          { key: "image_url", label: "صورة السلايد", type: "image" },
          { key: "title", label: "العنوان", type: "text", required: true },
          { key: "order_index", label: "الترتيب", type: "number" },
        ]}
      />
    </AdminShell>
  ),
});
