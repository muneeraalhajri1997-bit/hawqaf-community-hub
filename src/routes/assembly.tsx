import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users2, CalendarCheck, FileText, Loader2, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/assembly")({
  head: () => ({
    meta: [
      { title: "الجمعية العمومية | جمعية الأوقاف الصحية" },
      { name: "description", content: "أعضاء الجمعية العمومية واجتماعاتها ومحاضرها." },
    ],
  }),
  component: AssemblyPage,
});

type Member = {
  id: string;
  name: string;
  role: string | null;
  membership_start: string | null;
};

type Meeting = {
  id: string;
  title: string | null;
  meeting_date: string | null;
  meeting_type: string | null;
  minutes_url: string | null;
};

function formatDate(d: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
  } catch { return d; }
}

function AssemblyPage() {
  const membersQ = useQuery({
    queryKey: ["public", "assembly_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assembly_members")
        .select("id,name,role,membership_start")
        .eq("is_visible", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Member[];
    },
  });

  const meetingsQ = useQuery({
    queryKey: ["public", "assembly_meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assembly_meetings")
        .select("id,title,meeting_date,meeting_type,minutes_url")
        .eq("is_visible", true)
        .order("meeting_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Meeting[];
    },
  });

  return (
    <>
      <PageHeader badge="الحوكمة المؤسسية" title="الجمعية العمومية" subtitle="السلطة العليا للجمعية والمرجع الأول لقراراتها." />

      {/* Members */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-hero">
              <Users2 className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-2xl font-extrabold">الأعضاء العاملون</h2>
          </div>

          {membersQ.isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : membersQ.error ? (
            <p className="text-sm text-destructive">تعذّر تحميل الأعضاء.</p>
          ) : !membersQ.data || membersQ.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد بيانات أعضاء حالياً.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {membersQ.data.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                >
                  <h3 className="text-lg font-bold text-primary">{m.name}</h3>
                  {m.role && <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>}
                  {m.membership_start && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      عضو منذ: <span className="font-bold text-foreground">{formatDate(m.membership_start)}</span>
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Meetings */}
      <section className="bg-light-bg py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-hero">
              <CalendarCheck className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-2xl font-extrabold">اجتماعات الجمعية العمومية</h2>
          </div>

          {meetingsQ.isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : meetingsQ.error ? (
            <p className="text-sm text-destructive">تعذّر تحميل الاجتماعات.</p>
          ) : !meetingsQ.data || meetingsQ.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد اجتماعات منشورة حالياً.</p>
          ) : (
            <div className="space-y-4">
              {meetingsQ.data.map((m, i) => {
                const isExtra = (m.meeting_type ?? "").includes("غير");
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold">{m.title || "اجتماع الجمعية العمومية"}</h3>
                        {m.meeting_type && (
                          <span className={`rounded-full border px-3 py-0.5 text-xs font-bold ${
                            isExtra
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700"
                          }`}>
                            {m.meeting_type}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{formatDate(m.meeting_date)}</p>
                    </div>
                    {m.minutes_url && (
                      <a
                        href={m.minutes_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90"
                      >
                        <FileText className="h-4 w-4" />
                        محضر الاجتماع
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
