import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Shield, Download, ExternalLink, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/transparency")({
  head: () => ({
    meta: [
      { title: "الشفافية | جمعية الأوقاف الصحية" },
      { name: "description", content: "تقارير الجمعية المالية والإدارية والتشغيلية." },
    ],
  }),
  component: TransparencyPage,
});

type Doc = {
  id: string;
  title: string;
  category: string | null;
  file_url: string | null;
  published_at: string | null;
  is_visible: boolean | null;
  created_at: string;
};

function TransparencyPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["policy_documents", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("policy_documents")
        .select("id,title,category,file_url,published_at,is_visible,created_at")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Doc[];
    },
  });

  const grouped = data?.reduce<Record<string, Doc[]>>((acc, doc) => {
    const cat = doc.category ?? "أخرى";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  const categories = grouped ? Object.keys(grouped) : [];

  return (
    <>
      <PageHeader
        badge="حوكمة وشفافية"
        title="الشفافية"
        subtitle="نلتزم بأعلى معايير الشفافية والحوكمة في جميع أعمالنا."
      />

      <section className="bg-light-bg py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-6 text-center shadow-sm md:flex-row md:text-right"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white">
                <Shield className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-primary md:text-base">
                مسجلة بالمركز الوطني لتنمية القطاع غير الربحي برقم (1968)
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-border bg-white p-8 text-center text-destructive">
              حدث خطأ أثناء تحميل الوثائق. الرجاء المحاولة لاحقاً.
            </div>
          ) : !data || data.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-8 text-center text-muted-foreground">
              لا توجد وثائق متاحة حالياً.
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((cat, ci) => (
                <div key={cat}>
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.05 }}
                    className="mb-5 text-xl font-extrabold text-primary"
                  >
                    {cat}
                  </motion.h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {grouped![cat].map((doc, di) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: di * 0.06 }}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-hero">
                            <FileText className="h-5 w-5 text-accent" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-primary" title={doc.title}>
                              {doc.title}
                            </p>
                            {doc.published_at && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {doc.published_at}
                              </p>
                            )}
                          </div>
                        </div>
                        {doc.file_url ? (
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light-bg text-primary transition-colors hover:bg-accent hover:text-white"
                            aria-label="عرض / تحميل"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                            قريباً
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
