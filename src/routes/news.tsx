import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "الأخبار | جمعية الأوقاف الصحية" },
      { name: "description", content: "أحدث أخبار وفعاليات جمعية الأوقاف الصحية." },
    ],
  }),
  component: NewsPage,
});

type NewsRow = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  image_url: string | null;
  published_at: string | null;
};

function NewsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public", "news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id,title,excerpt,content,category,image_url,published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as NewsRow[];
    },
  });

  return (
    <>
      <PageHeader badge="آخر المستجدات" title="الأخبار والفعاليات" subtitle="تابع أحدث أخبار وفعاليات الجمعية." />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : error ? (
            <p className="text-center text-destructive">تعذر تحميل الأخبار.</p>
          ) : !data || data.length === 0 ? (
            <p className="text-center text-muted-foreground">لا توجد أخبار منشورة حالياً.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.map((n, i) => (
                <motion.article
                  key={n.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="flex h-44 items-center justify-center overflow-hidden bg-gradient-hero">
                    {n.image_url ? (
                      <img src={n.image_url} alt={n.title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <img src="/logo-icon.png" alt="" className="h-20 w-20 object-contain opacity-70" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs">
                      {n.category && (
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 font-bold text-accent">{n.category}</span>
                      )}
                      {n.published_at && (
                        <span className="text-muted-foreground">
                          {new Date(n.published_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug">{n.title}</h3>
                    {n.excerpt && <p className="mt-2 text-sm text-muted-foreground">{n.excerpt}</p>}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
