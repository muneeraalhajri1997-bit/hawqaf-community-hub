import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "التوظيف | جمعية الأوقاف الصحية" },
      { name: "description", content: "الوظائف الشاغرة وفرص العمل في جمعية الأوقاف الصحية." },
    ],
  }),
  component: CareersPage,
});

const JOBS = [
  { title: "أخصائي تسويق رقمي", dept: "التسويق والاتصال", location: "الدمام", type: "دوام كامل" },
  { title: "محاسب أول", dept: "الشؤون المالية", location: "الدمام", type: "دوام كامل" },
  { title: "مدير مشاريع وقفية", dept: "البرامج", location: "الدمام", type: "دوام كامل" },
  { title: "أخصائي علاقات حكومية", dept: "الشؤون المؤسسية", location: "الدمام", type: "دوام كامل" },
  { title: "منسق فعاليات", dept: "الفعاليات", location: "الدمام", type: "دوام جزئي" },
];

function CareersPage() {
  return (
    <>
      <PageHeader badge="انضم لفريقنا" title="التوظيف" subtitle="نبحث عن كوادر شغوفة لصناعة الأثر في القطاع الصحي الوقفي." />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl space-y-4 px-4 lg:px-6">
          {JOBS.map((j, i) => (
            <motion.div key={j.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-hero">
                  <Briefcase className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{j.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>{j.dept}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{j.type}</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]">
                التقديم <ArrowLeft className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
