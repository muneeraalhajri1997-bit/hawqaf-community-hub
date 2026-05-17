import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users2, Vote, CalendarCheck, FileText } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/assembly")({
  head: () => ({
    meta: [
      { title: "الجمعية العمومية | جمعية الأوقاف الصحية" },
      { name: "description", content: "معلومات عن الجمعية العمومية واجتماعاتها." },
    ],
  }),
  component: AssemblyPage,
});

const CARDS = [
  { title: "الأعضاء العاملون", desc: "قائمة بأسماء الأعضاء العاملين في الجمعية وحقوقهم وواجباتهم وفق اللائحة الأساسية.", Icon: Users2 },
  { title: "اجتماعات الجمعية العمومية", desc: "جدول الاجتماعات السنوية وغير العادية ومحاضر الاجتماعات السابقة.", Icon: CalendarCheck },
  { title: "حق التصويت", desc: "آلية التصويت على القرارات وانتخاب أعضاء مجلس الإدارة.", Icon: Vote },
  { title: "النظام الأساسي", desc: "اللائحة الأساسية المنظمة لأعمال الجمعية العمومية.", Icon: FileText },
];

function AssemblyPage() {
  return (
    <>
      <PageHeader badge="الحوكمة المؤسسية" title="الجمعية العمومية" subtitle="السلطة العليا للجمعية والمرجع الأول لقراراتها." />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 lg:px-6">
          {CARDS.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-white p-7 transition-all hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero">
                <c.Icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-bold">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
