import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/statistics")({
  head: () => ({
    meta: [
      { title: "المؤشرات | جمعية الأوقاف الصحية" },
      { name: "description", content: "مؤشرات الأداء والإنجازات السنوية للجمعية." },
    ],
  }),
  component: StatsPage,
});

const beneficiaries = [
  { year: "2021", value: 8500 },
  { year: "2022", value: 14200 },
  { year: "2023", value: 22000 },
  { year: "2024", value: 35400 },
  { year: "2025", value: 50000 },
];

const projects = [
  { year: "2021", value: 24 },
  { year: "2022", value: 41 },
  { year: "2023", value: 67 },
  { year: "2024", value: 94 },
  { year: "2025", value: 120 },
];

const distribution = [
  { name: "خدمات علاجية", value: 42 },
  { name: "أجهزة طبية", value: 28 },
  { name: "استثمارية", value: 18 },
  { name: "تعليم وبحث", value: 12 },
];

const COLORS = ["#00A0DF", "#00CE7C", "#002D5D", "#7BC9E8"];

function StatsPage() {
  return (
    <>
      <PageHeader badge="الأداء والأثر" title="المؤشرات" subtitle="نشارك أرقامنا بشفافية لقياس الأثر وتطوير الأداء." />
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold">المستفيدون عبر السنوات</h3>
            <p className="text-sm text-muted-foreground">عدد المستفيدين من برامج الجمعية.</p>
            <div className="mt-6 h-72">
              <ResponsiveContainer>
                <BarChart data={beneficiaries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
                  <XAxis dataKey="year" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00A0DF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold">نمو المشاريع الوقفية</h3>
            <p className="text-sm text-muted-foreground">إجمالي المشاريع التراكمي.</p>
            <div className="mt-6 h-72">
              <ResponsiveContainer>
                <LineChart data={projects}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
                  <XAxis dataKey="year" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#00CE7C" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-white p-6 shadow-sm md:col-span-2">
            <h3 className="text-lg font-bold">توزيع البرامج الوقفية</h3>
            <p className="text-sm text-muted-foreground">نسبة المشاريع حسب نوع المسار.</p>
            <div className="mt-6 h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                    {distribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
