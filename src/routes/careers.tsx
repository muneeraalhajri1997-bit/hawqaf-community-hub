import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Calendar, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "التوظيف | جمعية الأوقاف الصحية" },
      { name: "description", content: "الوظائف الشاغرة وفرص العمل في جمعية الأوقاف الصحية." },
    ],
  }),
  component: CareersPage,
});

type Job = {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  location: string | null;
  type: string | null;
  deadline?: string | null;
  is_active?: boolean | null;
};

function CareersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public", "jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      // Show only active when column exists; otherwise show all.
      return ((data ?? []) as Job[]).filter((j) => j.is_active === undefined || j.is_active === null || j.is_active === true);
    },
  });

  return (
    <>
      <PageHeader badge="انضم لفريقنا" title="الوظائف" subtitle="نبحث عن كوادر شغوفة لصناعة الأثر في القطاع الصحي الوقفي." />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl space-y-4 px-4 lg:px-6">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : error ? (
            <p className="text-center text-destructive">تعذر تحميل الوظائف.</p>
          ) : !data || data.length === 0 ? (
            <p className="text-center text-muted-foreground">لا توجد وظائف شاغرة حالياً.</p>
          ) : (
            data.map((j, i) => (
              <motion.div
                key={j.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg md:flex-row md:items-center"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-hero">
                    <Briefcase className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{j.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {j.department && <span>{j.department}</span>}
                      {j.location && (
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>
                      )}
                      {j.type && (
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{j.type}</span>
                      )}
                      {j.deadline && (
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />
                          آخر موعد: {new Date(j.deadline).toLocaleDateString("ar-SA")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
