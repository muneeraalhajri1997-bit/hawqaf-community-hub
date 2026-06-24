import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Newspaper, Layers, Briefcase, HeartHandshake, BarChart3, MessageSquare, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "لوحة الإدارة" }] }),
  component: AdminHome,
});

const CARDS: { table: string; label: string; to: string; icon: typeof Users }[] = [
  { table: "board_members", label: "أعضاء المجلس", to: "/admin/board", icon: Users },
  { table: "news", label: "الأخبار", to: "/admin/news", icon: Newspaper },
  { table: "programs", label: "البرامج", to: "/admin/programs", icon: Layers },
  { table: "statistics", label: "الإحصائيات", to: "/admin/statistics", icon: BarChart3 },
  { table: "jobs", label: "الوظائف", to: "/admin/jobs", icon: Briefcase },
  { table: "job_applications", label: "طلبات التوظيف", to: "/admin/job-applications", icon: ClipboardList },
  { table: "volunteers", label: "طلبات التطوع", to: "/admin/volunteers", icon: HeartHandshake },
  { table: "contact_messages", label: "رسائل التواصل", to: "/admin/contact-messages", icon: MessageSquare },
];

function AdminHome() {
  return (
    <AdminShell title="نظرة عامة">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => <StatCard key={c.table} {...c} />)}
      </div>
    </AdminShell>
  );
}

function StatCard({ table, label, to, icon: Icon }: { table: string; label: string; to: string; icon: typeof Users }) {
  const { data } = useQuery({
    queryKey: ["admin", "count", table],
    queryFn: async () => {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });
  return (
    <Link to={to as "/admin"} className="rounded-xl border border-border bg-white p-5 transition hover:border-primary hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-extrabold text-primary">{data ?? "—"}</p>
        </div>
        <Icon className="h-8 w-8 text-primary/40" />
      </div>
    </Link>
  );
}
