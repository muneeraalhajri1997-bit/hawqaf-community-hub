import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crown, User } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/board")({
  head: () => ({
    meta: [
      { title: "مجلس الإدارة | جمعية الأوقاف الصحية" },
      { name: "description", content: "أعضاء مجلس إدارة جمعية الأوقاف الصحية." },
    ],
  }),
  component: BoardPage,
});

const MEMBERS = [
  { name: "الأستاذ عبدالحكيم بن حمد بن عمار الخالدي", role: "رئيس مجلس الإدارة", bio: "رئيس مجلس إدارة شركة الشرقية للطاقة" },
  { name: "الدكتور وليد بن حمد بن أحمد البوعلي", role: "نائب رئيس مجلس الإدارة", bio: "أستاذ بجامعة عبدالرحمن بن فيصل والمدير الطبي لمجموعة مستشفيات المواساة" },
  { name: "الدكتور حسن بن إبراهيم العماري", role: "عضو", bio: "استشاري الأمراض الجلدية في المستشفى السعودي الألماني بالدمام" },
  { name: "المهندس عبدالرحمن بن فوزان الحمين", role: "عضو", bio: "مستشار الرئيس التنفيذي للشؤون العامة والتطوير" },
  { name: "الدكتورة إلهام أحمد الجناحي", role: "عضو", bio: "استشاري طب الأسرة والمجتمع - المدير الطبي بشركة جينو كلينك" },
  { name: "الأستاذ علي بن سعد القحطاني", role: "عضو", bio: "الرئيس التنفيذي لمجموعة بن سلطان القابضة" },
  { name: "المحامي محمد عماد اليحيى", role: "عضو", bio: "مؤسس وشريك في شركة إيضاح للمحاماة" },
  { name: "المهندس ناصر مبارك القحطاني", role: "عضو", bio: "الرئيس التنفيذي لمجموعة المعجل القابضة" },
  { name: "الدكتور نواف بن عبدالله العتيبي", role: "عضو", bio: "طبيب أمراض نفسية - مساعد مدير عام فرع وزارة الصحة بالشرقية" },
  { name: "الدكتور خالد محمد العرفج", role: "عضو", bio: "استشاري طب وجراحة العيون - كبير الأطباء بمستشفيات المغربي" },
  { name: "الدكتور منصور أحمد توفيق", role: "عضو", bio: "جراح مؤسس لمركز زراعة الأعضاء بتخصصي الدمام" },
  { name: "الدكتور عبدالرحمن فؤاد الخطيب", role: "عضو", bio: "استشاري طب الأسرة بتجمع الشرقية الصحي" },
  { name: "البروفيسور عبدالله أحمد العثمان", role: "عضو", bio: "بروفيسور جراحة العظام والعمود الفقري" },
];

function BoardPage() {
  return (
    <>
      <PageHeader badge="حوكمة الجمعية" title="مجلس الإدارة" subtitle="نخبة من القيادات في القطاعات الصحية والاقتصادية والقانونية." />

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          {/* Honorary President */}
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
                <p className="mt-2 text-sm md:text-base" style={{ color: "#7A6314" }}>
                  أمير المنطقة الشرقية
                </p>
              </div>
            </div>
          </motion.div>

          {/* Term */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-8 rounded-xl bg-light-bg p-4 text-center text-sm font-semibold text-primary">
            الدورة الحالية: من 2024/11/20م إلى 2028/11/20م
          </motion.div>

          {/* Members grid */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MEMBERS.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.05 }}
                className="rounded-2xl border border-border bg-white p-6 text-right transition-all hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero">
                  <User className="h-7 w-7 text-accent" />
                </div>
                <span className="text-xs font-bold text-accent">{m.role}</span>
                <h3 className="mt-2 text-base font-bold leading-snug">{m.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
