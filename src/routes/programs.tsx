import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "البرامج | جمعية الأوقاف الصحية" },
      { name: "description", content: "تعرف على مسارات الجمعية الوقفية في القطاع الصحي." },
    ],
  }),
  component: ProgramsPage,
});

type Program = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  status: string | null;
  goal_amount?: number | null;
  amount_raised?: number | null;
};

function ProgramsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public", "programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Program[];
    },
  });

  return (
    <>
      <PageHeader badge="مساراتنا الوقفية" title="البرامج" subtitle="مسارات متعددة تعمل معاً لبناء منظومة صحية وقفية مستدامة." />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : error ? (
            <p className="text-center text-destructive">تعذر تحميل البرامج.</p>
          ) : !data || data.length === 0 ? (
            <p className="text-center text-muted-foreground">لا توجد برامج متاحة حالياً.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.map((p, i) => {
                const goal = Number(p.goal_amount ?? 0);
                const raised = Number(p.amount_raised ?? 0);
                const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl"
                  >
                    <div className="flex h-44 items-center justify-center overflow-hidden bg-gradient-hero">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <img src="/logo-icon.png" alt="" className="h-20 w-20 object-contain opacity-70" />
                      )}
                    </div>
                    <div className="p-6">
                      {p.category && (
                        <span className="inline-block rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">{p.category}</span>
                      )}
                      <h3 className="mt-3 text-lg font-bold leading-snug">{p.title}</h3>
                      {p.description && <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>}

                      {goal > 0 && (
                        <div className="mt-5">
                          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                            <span>{raised.toLocaleString("en-US")} ر.س</span>
                            <span>{goal.toLocaleString("en-US")} ر.س</span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-light-bg">
                            <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="mt-1 text-xs font-bold text-accent">{pct}%</p>
                        </div>
                      )}
                    </div>
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
