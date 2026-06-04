import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/jobs")({
  head: () => ({ meta: [{ title: "الوظائف - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="الوظائف">
      <CrudTable
        table="jobs"
        orderBy="created_at"
        listColumns={[
          { key: "title", label: "المسمى" },
          { key: "department", label: "القسم" },
          { key: "location", label: "المكان" },
          { key: "type", label: "النوع" },
        ]}
        fields={[
          { key: "title", label: "المسمى الوظيفي", type: "text", required: true },
          { key: "description", label: "الوصف", type: "textarea", required: true },
          { key: "requirements", label: "المتطلبات", type: "textarea" },
          { key: "department", label: "القسم", type: "text" },
          { key: "location", label: "المكان", type: "text" },
          { key: "type", label: "نوع الدوام", type: "select", options: [
            { value: "full-time", label: "دوام كامل" },
            { value: "part-time", label: "دوام جزئي" },
            { value: "contract", label: "عقد" },
            { value: "internship", label: "تدريب" },
          ]},
        ]}
      />
    </AdminShell>
  ),
});
