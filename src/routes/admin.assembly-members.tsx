import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/assembly-members")({
  head: () => ({ meta: [{ title: "أعضاء الجمعية العمومية - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="أعضاء الجمعية العمومية">
      <CrudTable
        table="assembly_members"
        orderBy="order_index"
        ascending
        defaults={{ order_index: 0, is_visible: true, is_active: true }}
        listColumns={[
          { key: "order_index", label: "الترتيب" },
          { key: "name", label: "الاسم" },
          { key: "role", label: "الصفة" },
          {
            key: "membership_start",
            label: "تاريخ بداية العضوية",
            render: (r) => (r.membership_start ? String(r.membership_start).slice(0, 10) : "—"),
          },
          {
            key: "is_visible",
            label: "ظاهر",
            render: (r) => (r.is_visible ? "نعم" : "لا"),
          },
        ]}
        fields={[
          { key: "name", label: "الاسم", type: "text", required: true },
          { key: "role", label: "الصفة / الدور", type: "text", placeholder: "مثل: عضو مؤسس" },
          { key: "membership_start", label: "تاريخ بداية العضوية", type: "date" },
          { key: "order_index", label: "الترتيب", type: "number" },
          { key: "is_visible", label: "ظاهر للجمهور", type: "boolean" },
        ]}
      />
    </AdminShell>
  ),
});
