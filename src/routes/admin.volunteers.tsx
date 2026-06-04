import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/volunteers")({
  head: () => ({ meta: [{ title: "طلبات التطوع - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="طلبات التطوع">
      <CrudTable
        table="volunteers"
        orderBy="id"
        readOnly
        emptyText="لا توجد طلبات تطوع بعد."
        listColumns={[
          { key: "full_name", label: "الاسم" },
          { key: "email", label: "البريد" },
          { key: "phone", label: "الجوال" },
          { key: "status", label: "الحالة" },
          { key: "message", label: "الرسالة" },
        ]}
        fields={[]}
      />
    </AdminShell>
  ),
});
