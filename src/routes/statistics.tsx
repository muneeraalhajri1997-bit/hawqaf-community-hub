import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/statistics")({
  head: () => ({
    meta: [
      { title: "المؤشرات | جمعية الأوقاف الصحية" },
      { name: "description", content: "مؤشرات الأداء والإنجازات السنوية للجمعية." },
    ],
  }),
  component: StatsPage,
});

type Stat = { id: string; label: string; value: string; icon: string | null; order_index: number | null };

function StatsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public", "statistics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("statistics")
        .select("id,label,value,icon,order_index")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Stat[];
    },
  });

  return (
    <>
      <PageHeader badge="الأداء والأثر" title="المؤشرات" subtitle="نشارك أرقامنا بشفافية لقياس الأثر وتطوير الأداء." />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : error ? (
            <p className="text-center text-destructive">تعذر تحميل المؤشرات.</p>
          ) : !data || data.length === 0 ? (
            <p className="text-center text-muted-foreground">لا توجد مؤشرات متاحة حالياً.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-white p-6 text-center transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-hero">
                    {s.icon ? <span className="text-xl">{s.icon}</span> : <TrendingUp className="h-6 w-6 text-accent" />}
                  </div>
                  <div className="text-3xl font-extrabold text-primary md:text-4xl">{s.value}</div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
