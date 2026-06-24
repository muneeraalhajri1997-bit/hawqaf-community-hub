import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Clock, Calendar, Loader2, CheckCircle2, UploadCloud, X } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "التوظيف | جمعية الأوقاف الصحية" },
      { name: "description", content: "الوظائف الشاغرة وفرص العمل في جمعية الأوقاف الصحية." },
    ],
  }),
  component: CareersPage,
});

type Job = {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  location: string | null;
  type: string | null;
  deadline?: string | null;
  is_active?: boolean | null;
};

const EDUCATION_OPTIONS = [
  { value: "ثانوية عامة", label: "ثانوية عامة" },
  { value: "دبلوم", label: "دبلوم" },
  { value: "بكالوريوس", label: "بكالوريوس" },
  { value: "ماجستير", label: "ماجستير" },
  { value: "دكتوراه", label: "دكتوراه" },
  { value: "أخرى", label: "أخرى" },
];

const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  education: "",
  experience_years: "",
  cover_letter: "",
};

function ApplyForm({ job, onDone }: { job: Job; onDone: () => void }) {
  const [form, setForm] = useState(emptyForm);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("حجم الملف يجب أن يكون أقل من 5 ميجابايت.");
      return;
    }
    setErrorMsg(null);
    setCvFile(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    let cv_url: string | null = null;
    if (cvFile) {
      setUploading(true);
      const ext = cvFile.name.split(".").pop();
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from("cvs").upload(path, cvFile);
      setUploading(false);
      if (uploadError) { setErrorMsg("تعذر رفع السيرة الذاتية. حاول مرة أخرى."); setSubmitting(false); return; }
      const { data: { publicUrl } } = supabase.storage.from("cvs").getPublicUrl(uploadData.path);
      cv_url = publicUrl;
    }
    const payload = { job_id: job.id, job_title: job.title, full_name: form.full_name, email: form.email, phone: form.phone, education: form.education || null, experience_years: form.experience_years || null, cover_letter: form.cover_letter || null, cv_url };
    const { error } = await supabase.from("job_applications").insert(payload);
    if (error) { setErrorMsg("تعذر إرسال الطلب. حاول مرة أخرى لاحقاً."); setSubmitting(false); return; }
    supabase.functions.invoke("send-email", { body: { type: "job_application", data: payload } }).catch(console.error);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-light-bg p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent" />
        <p className="font-bold text-primary">تم استلام طلبك بنجاح!</p>
        <p className="text-sm text-muted-foreground">سيتم التواصل معك في حال كان ملفك مناسباً للوظيفة.</p>
        <button onClick={onDone} className="mt-2 text-sm font-semibold text-accent hover:underline">إغلاق</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-light-bg p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input required placeholder="الاسم الكامل" value={form.full_name} onChange={set("full_name")} className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent" />
        <input required type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={set("email")} className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent" />
        <input required placeholder="رقم الجوال" value={form.phone} onChange={set("phone")} className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent" />
        <select value={form.education} onChange={set("education")} className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent">
          <option value="">المؤهل العلمي</option>
          {EDUCATION_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
        <input placeholder="سنوات الخبرة" value={form.experience_years} onChange={set("experience_years")} className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent" />
        <div>
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-white px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent">
            <UploadCloud className="h-4 w-4" />
            {cvFile ? cvFile.name : "رفع السيرة الذاتية (PDF أو Word)"}
          </button>
          {cvFile && (<button type="button" onClick={() => { setCvFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /> إزالة الملف</button>)}
        </div>
      </div>
      <textarea placeholder="رسالة تعريفية (اختياري)" value={form.cover_letter} onChange={set("cover_letter")} rows={3} className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-right outline-none focus:border-accent" />
      {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting || uploading} className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-6 py-2.5 text-sm font-bold text-white shadow-md disabled:opacity-60">
          {(submitting || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
          {uploading ? "جارٍ رفع الملف..." : submitting ? "جارٍ الإرسال..." : "إرسال الطلب"}
        </button>
        <button type="button" onClick={onDone} className="text-sm font-semibold text-muted-foreground hover:underline">إلغاء</button>
      </div>
    </form>
  );
}

function CareersPage() {
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["public", "jobs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as Job[]).filter((j) => j.is_active === undefined || j.is_active === null || j.is_active === true);
    },
  });
  return (
    <>
      <PageHeader badge="انضم لفريقنا" title="الوظائف" subtitle="نبحث عن كوادر شغوفة لصناعة الأثر في القطاع الصحي الوقفي." />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl space-y-4 px-4 lg:px-6">
          {isLoading ? (<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>)
            : error ? (<p className="text-center text-destructive">تعذر تحميل الوظائف.</p>)
            : !data || data.length === 0 ? (<p className="text-center text-muted-foreground">لا توجد وظائف شاغرة حالياً.</p>)
            : data.map((j, i) => (
              <motion.div key={j.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-white p-6 transition-all hover:border-accent/40 hover:shadow-lg">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-hero"><Briefcase className="h-6 w-6 text-accent" /></div>
                    <div>
                      <h3 className="text-lg font-bold">{j.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {j.department && <span>{j.department}</span>}
                        {j.location && (<span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>)}
                        {j.type && (<span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{j.type}</span>)}
                        {j.deadline && (<span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />آخر موعد: {new Date(j.deadline).toLocaleDateString("ar-SA-u-nu-latn")}</span>)}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setOpenJobId((id) => (id === j.id ? null : j.id))} className="shrink-0 rounded-lg bg-gradient-brand px-6 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.03]">
                    {openJobId === j.id ? "إغلاق النموذج" : "تقديم على الوظيفة"}
                  </button>
                </div>
                <AnimatePresence>
                  {openJobId === j.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6 overflow-hidden">
                      <ApplyForm job={j} onDone={() => setOpenJobId(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </div>
      </section>
    </>
  );
}
