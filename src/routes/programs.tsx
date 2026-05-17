import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Stethoscope, HeartPulse, TrendingUp, GraduationCap, FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "البرامج | جمعية الأوقاف الصحية" },
      { name: "description", content: "تعرف على مسارات الجمعية الوقفية في القطاع الصحي." },
    ],
  }),
  component: ProgramsPage,
});

const PROGRAMS = [
  { title: "أوقاف تقدم الخدمات العلاجية", desc: "توفير الرعاية الصحية المباشرة للمرضى والفقراء والمحتاجين عبر شبكة من الشركاء.", Icon: Stethoscope },
  { title: "أوقاف الأجهزة الطبية", desc: "تجهيز المرافق الصحية بالأجهزة الطبية الحديثة لخدمة المجتمع.", Icon: HeartPulse },
  { title: "أوقاف استثمارية", desc: "مشاريع استثمارية تدر عائداً مستداماً لدعم البرامج الصحية الوقفية.", Icon: TrendingUp },
  { title: "أوقاف التعليم الصحي", desc: "دعم برامج التعليم والتدريب الصحي ورفع كفاءة الكوادر العاملة.", Icon: GraduationCap },
  { title: "أوقاف البحث والتطوير", desc: "تمويل الأبحاث الطبية والمشاريع البحثية في القطاع الصحي.", Icon: FlaskConical },
];

function ProgramsPage() {
  return (
    <>
      <PageHeader badge="مساراتنا الوقفية" title="البرامج" subtitle="مسارات متعددة تعمل معاً لبناء منظومة صحية وقفية مستدامة." />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-6">
          {PROGRAMS.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-white p-7 transition-all hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero">
                <p.Icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
