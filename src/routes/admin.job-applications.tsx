import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/admin/job-applications")({
  head: () => ({ meta: [{ title: "طلبات التوظيف - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="طلبات التوظيف">
      <CrudTable
        table="job_applications"
        orderBy="submitted_at"
        ascending={false}
        readOnly
        emptyText="لا توجد طلبات توظيف بعد."
        listColumns={[
          { key: "job_title", label: "الوظيفة" },
          { key: "full_name", label: "الاسم" },
          { key: "email", label: "البريد" },
          { key: "phone", label: "الجوال" },
          { key: "education", label: "المؤهل" },
          { key: "experience_years", label: "الخبرة" },
          {
            key: "cv_url",
            label: "السيرة الذاتية",
            render: (row) =>
              row.cv_url ? (
                <a href={row.cv_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary hover:bg-primary/20">
                  <FileText className="h-3.5 w-3.5" />تحميل
                </a>
              ) : <span className="text-muted-foreground">—</span>,
          },
          {
            key: "submitted_at",
            label: "تاريخ التقديم",
            render: (row) => row.submitted_at ? new Date(row.submitted_at).toLocaleDateString("ar-SA-u-nu-latn") : "—",
          },
          {
            key: "status",
            label: "الحالة",
            render: (row) => {
              const colors: Record<string, string> = { pending: "bg-yellow-100 text-yellow-800", reviewed: "bg-blue-100 text-blue-800", accepted: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
              const labels: Record<string, string> = { pending: "قيد المراجعة", reviewed: "تمت المراجعة", accepted: "مقبول", rejected: "مرفوض" };
              const status = row.status ?? "pending";
              return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors[status] ?? "bg-gray-100 text-gray-700"}`}>{labels[status] ?? status}</span>;
            },
          },
        ]}
        fields={[]}
      />
    </AdminShell>
  ),
});
