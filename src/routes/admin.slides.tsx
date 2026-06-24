import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { ImageThumb } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/slides")({
  head: () => ({ meta: [{ title: "السلايدر - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="السلايدر">
      <CrudTable
        table="slides"
        orderBy="order_index"
        ascending
        defaults={{ order_index: 0, is_active: true }}
        listColumns={[
          { key: "image_url", label: "الصورة", render: (r) => <ImageThumb src={r.image_url} /> },
          { key: "order_index", label: "الترتيب" },
          { key: "title", label: "العنوان" },
          { key: "description", label: "الوصف" },
          {
            key: "is_active",
            label: "مفعّل",
            render: (r) => (
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  r.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {r.is_active ? "نعم" : "لا"}
              </span>
            ),
          },
        ]}
        fields={[
          { key: "image_url", label: "صورة الشريحة", type: "image" },
          { key: "title", label: "العنوان", type: "text", required: true },
          { key: "description", label: "الوصف", type: "textarea" },
          { key: "order_index", label: "الترتيب (رقم)", type: "number" },
          { key: "is_active", label: "مفعّل", type: "boolean" },
        ]}
      />
    </AdminShell>
  ),
});
