import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | جمعية الأوقاف الصحية" },
      { name: "description", content: "تواصل مع جمعية الأوقاف الصحية." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHeader badge="نحن هنا لخدمتكم" title="تواصل معنا" subtitle="فريقنا جاهز للرد على استفساراتكم." />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2 lg:px-6">
          <div className="space-y-5">
            {[
              { Icon: MapPin, title: "العنوان", value: "الشرقية - الدمام – حي الفردوس – طريق الأمير محمد بن فهد الفرعي" },
              { Icon: Mail, title: "البريد", value: "info@hawqaf.org.sa", href: "mailto:info@hawqaf.org.sa" },
              { Icon: Phone, title: "الهاتف", value: "013 829 2840", href: "tel:0138292840" },
            ].map((c) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex gap-4 rounded-2xl border border-border bg-white p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-hero">
                  <c.Icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold">{c.title}</h3>
                  {c.href ? (
                    <a href={c.href} dir={c.Icon === Phone ? "ltr" : undefined} className="mt-1 block text-sm text-muted-foreground hover:text-accent">
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">{c.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="rounded-3xl bg-light-bg p-7 shadow-sm">
            {sent ? (
              <div className="py-8 text-center">
                <Send className="mx-auto h-10 w-10 text-brand-green" />
                <p className="mt-3 font-bold text-primary">تم إرسال رسالتك بنجاح!</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold">أرسل رسالتك</h2>
                <div className="mt-5 space-y-4">
                  <input required placeholder="الاسم" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent" />
                  <input required type="email" placeholder="البريد الإلكتروني" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent" />
                  <input required placeholder="الموضوع" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent" />
                  <textarea required rows={5} placeholder="رسالتك" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent" />
                  <button type="submit" className="w-full rounded-lg bg-gradient-brand px-5 py-3 font-bold text-white transition-transform hover:scale-[1.02]">
                    إرسال
                  </button>
                </div>
              </>
            )}
          </motion.form>
        </div>
      </section>
    </>
  );
}
