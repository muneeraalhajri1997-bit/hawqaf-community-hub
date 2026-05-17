import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "الأخبار | جمعية الأوقاف الصحية" },
      { name: "description", content: "أحدث أخبار وفعاليات جمعية الأوقاف الصحية." },
    ],
  }),
  component: NewsPage,
});

const NEWS = [
  { tag: "إعلان", date: "10 مايو 2026", title: "إطلاق وقف الأجهزة الطبية المتقدمة", desc: "توقيع شراكة استراتيجية لتجهيز أربع مستشفيات في المنطقة الشرقية." },
  { tag: "فعالية", date: "28 أبريل 2026", title: "ملتقى الأوقاف الصحية السنوي 2026", desc: "تنظيم الجمعية لملتقاها السنوي بحضور مسؤولين من القطاع الصحي." },
  { tag: "تقرير", date: "15 أبريل 2026", title: "نتائج البرامج الوقفية للربع الأول", desc: "أكثر من 12,000 مستفيد خلال الربع الأول من العام الجاري." },
  { tag: "شراكة", date: "2 أبريل 2026", title: "اتفاقية مع وزارة الصحة لتطوير البنية الصحية", desc: "توقيع مذكرة تعاون لدعم مشاريع وقفية صحية في عدة مناطق." },
  { tag: "إعلان", date: "20 مارس 2026", title: "افتتاح فرع جديد لخدمات الجمعية", desc: "بدء تشغيل المقر الجديد لتقديم خدمات أوسع للمستفيدين." },
  { tag: "تقرير", date: "5 مارس 2026", title: "تقرير الأثر الاجتماعي 2025", desc: "نشر تقرير الأثر السنوي الذي يستعرض إنجازات الجمعية." },
];

function NewsPage() {
  return (
    <>
      <PageHeader badge="آخر المستجدات" title="الأخبار والفعاليات" subtitle="تابع أحدث أخبار وفعاليات الجمعية." />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-6">
          {NEWS.map((n, i) => (
            <motion.article key={n.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1.5 hover:shadow-xl">
              <div className="flex h-44 items-center justify-center bg-gradient-hero">
                <HeartPulse className="h-20 w-20 text-accent/60" strokeWidth={1.2} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 font-bold text-accent">{n.tag}</span>
                  <span className="text-muted-foreground">{n.date}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug">{n.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{n.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
