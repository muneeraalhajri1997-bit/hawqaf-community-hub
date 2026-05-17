import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Shield, BadgeCheck, Scale, Download } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/transparency")({
  head: () => ({
    meta: [
      { title: "الشفافية | جمعية الأوقاف الصحية" },
      { name: "description", content: "تقارير الجمعية المالية والإدارية والتشغيلية." },
    ],
  }),
  component: TransparencyPage,
});

const DOCS = [
  { title: "التقرير السنوي 2024", Icon: FileText },
  { title: "القوائم المالية المدققة 2024", Icon: Scale },
  { title: "الخطة الاستراتيجية 2023-2028", Icon: BadgeCheck },
  { title: "اللائحة الأساسية للجمعية", Icon: Shield },
  { title: "تقرير الأثر الاجتماعي 2024", Icon: FileText },
  { title: "سياسة الحوكمة وتعارض المصالح", Icon: Shield },
];

function TransparencyPage() {
  return (
    <>
      <PageHeader badge="حوكمة وشفافية" title="الشفافية" subtitle="نلتزم بأعلى معايير الشفافية والحوكمة في جميع أعمالنا." />
      <section className="bg-light-bg py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-6 text-center shadow-sm md:flex-row md:text-right">
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
        <div className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-6">
          {DOCS.map((d, i) => (
            <motion.div key={d.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
                  <d.Icon className="h-6 w-6 text-accent" />
                </div>
                <span className="font-bold text-primary">{d.title}</span>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-light-bg text-primary transition-colors hover:bg-accent hover:text-white" aria-label="تحميل">
                <Download className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
