import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { ImageThumb } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/board")({
  head: () => ({ meta: [{ title: "مجلس الإدارة - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="مجلس الإدارة">
      <CrudTable
        table="board_members"
        orderBy="order_index"
        ascending
        defaults={{ order_index: 0, is_current: true, term_number: 1 }}
        listColumns={[
          { key: "image_url", label: "الصورة", render: (r) => <ImageThumb src={r.image_url} /> },
          { key: "order_index", label: "الترتيب" },
          { key: "name", label: "الاسم" },
          { key: "role", label: "المنصب" },
          { key: "is_current", label: "حالي", render: (r) => (r.is_current ? "نعم" : "لا") },
        ]}
        fields={[
          { key: "image_url", label: "صورة العضو", type: "image" },
          { key: "name", label: "الاسم", type: "text", required: true },
          { key: "role", label: "المنصب", type: "text", required: true },
          { key: "bio", label: "نبذة", type: "textarea" },
          { key: "order_index", label: "الترتيب", type: "number" },
          { key: "term_number", label: "رقم الدورة", type: "number" },
          { key: "is_current", label: "عضو حالي", type: "boolean" },
        ]}
      />
    </AdminShell>
  ),
});
