import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { HandHeart, Users, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "التطوع | جمعية الأوقاف الصحية" },
      { name: "description", content: "انضم إلى فريق متطوعي جمعية الأوقاف الصحية." },
    ],
  }),
  component: VolunteerPage,
});

function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <PageHeader badge="كن جزءاً من العطاء" title="التطوع" subtitle="انضم لفريق المتطوعين وساهم في بناء مستقبل صحي مستدام." />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 lg:px-6">
          <div className="space-y-6">
            {[
              { Icon: HandHeart, title: "أثر ملموس", desc: "كل ساعة تطوع تصنع فرقاً حقيقياً في حياة المرضى والمحتاجين." },
              { Icon: Users, title: "تجربة إنسانية", desc: "بيئة عمل ملهمة مع نخبة من المتطوعين والمختصين." },
              { Icon: Sparkles, title: "شهادات وتقدير", desc: "نوثق ساعات التطوع ونمنح شهادات معتمدة لكل متطوع." },
            ].map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-hero">
                  <b.Icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold">{b.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="rounded-3xl bg-light-bg p-7 shadow-sm"
          >
            <h2 className="text-xl font-bold">سجّل كمتطوع</h2>
            <p className="mt-1 text-sm text-muted-foreground">سنتواصل معك خلال أيام عمل.</p>

            {submitted ? (
              <div className="mt-6 rounded-xl bg-white p-6 text-center">
                <Sparkles className="mx-auto h-10 w-10 text-brand-green" />
                <p className="mt-3 font-bold text-primary">شكراً لتسجيلك! سنتواصل معك قريباً.</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <input required placeholder="الاسم الكامل" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none transition-colors focus:border-accent" />
                <input required type="email" placeholder="البريد الإلكتروني" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none transition-colors focus:border-accent" />
                <input required type="tel" placeholder="رقم الجوال" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none transition-colors focus:border-accent" />
                <select required className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent">
                  <option value="">مجال التطوع</option>
                  <option>الفعاليات والمؤتمرات</option>
                  <option>التسويق والإعلام</option>
                  <option>التعليم والتدريب</option>
                  <option>الدعم الإداري</option>
                </select>
                <textarea rows={4} placeholder="نبذة عن خبراتك" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent" />
                <button type="submit" className="w-full rounded-lg bg-gradient-brand px-5 py-3 font-bold text-white transition-transform hover:scale-[1.02]">
                  إرسال الطلب
                </button>
              </div>
            )}
          </motion.form>
        </div>
      </section>
    </>
  );
}
