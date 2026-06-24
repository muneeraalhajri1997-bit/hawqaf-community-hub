import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/contact-messages")({
  head: () => ({ meta: [{ title: "رسائل التواصل - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="رسائل التواصل">
      <CrudTable
        table="contact_messages"
        orderBy="submitted_at"
        ascending={false}
        readOnly
        emptyText="لا توجد رسائل بعد."
        listColumns={[
          { key: "full_name", label: "الاسم" },
          { key: "email", label: "البريد" },
          { key: "subject", label: "الموضوع" },
          { key: "message", label: "الرسالة" },
          {
            key: "submitted_at",
            label: "التاريخ",
            render: (row) =>
              row.submitted_at
                ? new Date(row.submitted_at).toLocaleDateString("ar-SA-u-nu-latn")
                : "—",
          },
          {
            key: "status",
            label: "الحالة",
            render: (row) => {
              const colors: Record<string, string> = {
                new: "bg-blue-100 text-blue-800",
                read: "bg-gray-100 text-gray-700",
                replied: "bg-green-100 text-green-800",
              };
              const labels: Record<string, string> = {
                new: "جديدة",
                read: "مقروءة",
                replied: "تم الرد",
              };
              const status = row.status ?? "new";
              return (
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors[status] ?? "bg-gray-100 text-gray-700"}`}>
                  {labels[status] ?? status}
                </span>
              );
            },
          },
        ]}
        fields={[]}
      />
    </AdminShell>
  ),
});
