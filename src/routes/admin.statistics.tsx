import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/statistics")({
  head: () => ({ meta: [{ title: "الإحصائيات - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="الإحصائيات">
      <CrudTable
        table="statistics"
        orderBy="order_index"
        ascending
        defaults={{ order_index: 0 }}
        listColumns={[
          { key: "order_index", label: "الترتيب" },
          { key: "label", label: "التسمية" },
          { key: "value", label: "القيمة" },
          { key: "icon", label: "الأيقونة" },
        ]}
        fields={[
          { key: "label", label: "التسمية", type: "text", required: true },
          { key: "value", label: "القيمة", type: "text", required: true },
          { key: "icon", label: "الأيقونة", type: "text" },
          { key: "order_index", label: "الترتيب", type: "number" },
        ]}
      />
    </AdminShell>
  ),
});
