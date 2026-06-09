import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Crown, User, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/board")({
  head: () => ({
    meta: [
      { title: "مجلس الإدارة | جمعية الأوقاف الصحية" },
      { name: "description", content: "أعضاء مجلس إدارة جمعية الأوقاف الصحية." },
    ],
  }),
  component: BoardPage,
});

type BoardMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  order_index: number | null;
};

function BoardPage() {
  const { data: members, isLoading, error } = useQuery({
    queryKey: ["public", "board_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("board_members")
        .select("id, name, role, bio, image_url, order_index")
        .eq("is_current", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data ?? []) as BoardMember[];
    },
  });

  return (
    <>
      <PageHeader badge="حوكمة الجمعية" title="مجلس الإدارة" subtitle="نخبة من القيادات في القطاعات الصحية والاقتصادية والقانونية." />

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="overflow-hidden rounded-3xl border-2 p-8 md:p-10"
            style={{ borderColor: "#B8972A", backgroundColor: "#FFFBF0" }}
          >
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-right">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl shadow-md" style={{ background: "linear-gradient(135deg,#D4AF37,#B8972A)" }}>
                <Crown className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1">
                <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-bold" style={{ color: "#B8972A" }}>
                  الرئيس الفخري
                </span>
                <h2 className="mt-3 text-xl font-extrabold md:text-2xl" style={{ color: "#7A6314" }}>
                  صاحب السمو الملكي الأمير سعود بن نايف بن عبدالعزيز آل سعود
                </h2>
                <p className="mt-2 text-sm md:text-base" style={{ color: "#7A6314" }}>أمير المنطقة الشرقية</p>
              </div>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="mt-10 flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="mr-3 text-sm">جارٍ تحميل أعضاء المجلس...</span>
            </div>
          ) : error ? (
            <div className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
              تعذّر تحميل أعضاء المجلس.
            </div>
          ) : !members || members.length === 0 ? (
            <div className="mt-10 rounded-xl border border-border bg-light-bg p-6 text-center text-sm text-muted-foreground">
              لا توجد بيانات أعضاء حالياً.
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {members.map((m, i) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-border bg-white text-right transition-all hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl">
                  <div className="flex h-48 items-center justify-center overflow-hidden bg-gradient-hero">
                    {m.image_url ? (
                      <img src={m.image_url} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/60">
                        <User className="h-8 w-8 text-accent" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-bold text-accent">{m.role}</span>
                    <h3 className="mt-2 text-base font-bold leading-snug">{m.name}</h3>
                    {m.bio && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
