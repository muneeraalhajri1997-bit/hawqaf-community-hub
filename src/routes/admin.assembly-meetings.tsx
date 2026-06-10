import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, type DragEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2, Upload, Trash2, FileText, ExternalLink, UploadCloud, X, Eye, EyeOff, CalendarCheck,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/assembly-meetings")({
  head: () => ({ meta: [{ title: "اجتماعات الجمعية - لوحة الإدارة" }] }),
  component: () => (
    <AdminShell title="اجتماعات الجمعية العمومية">
      <MeetingsManager />
    </AdminShell>
  ),
});

const BUCKET = "documents";
const TYPES = ["عادية", "غير عادية"] as const;

type Meeting = {
  id: string;
  title: string | null;
  meeting_date: string | null;
  meeting_type: string | null;
  minutes_url: string | null;
  is_visible: boolean | null;
  created_at: string;
};

function formatSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function MeetingsManager() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().slice(0, 10));
  const [meetingType, setMeetingType] = useState<string>(TYPES[0]);
  const [isVisible, setIsVisible] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "assembly_meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assembly_meetings")
        .select("id,title,meeting_date,meeting_type,minutes_url,is_visible,created_at")
        .order("meeting_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Meeting[];
    },
  });

  const counts = useMemo(() => {
    const m = { total: 0, "عادية": 0, "غير عادية": 0 } as Record<string, number>;
    (data ?? []).forEach((r) => { m.total++; if (r.meeting_type && m[r.meeting_type] !== undefined) m[r.meeting_type]++; });
    return m;
  }, [data]);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      alert("يجب أن يكون الملف PDF");
      return;
    }
    setFile(f);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const uploadMut = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("الرجاء إدخال عنوان الاجتماع");
      let minutes_url: string | null = null;
      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `assembly/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        setProgress(10);
        const tick = setInterval(() => setProgress((p) => (p < 85 ? p + Math.random() * 8 : p)), 200);
        try {
          const { error: upErr } = await supabase.storage
            .from(BUCKET)
            .upload(path, file, { contentType: "application/pdf", upsert: false });
          if (upErr) throw upErr;
          const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
          minutes_url = pub.publicUrl;
          setProgress(100);
        } finally { clearInterval(tick); }
      }
      const { error: insErr } = await supabase.from("assembly_meetings").insert({
        title: title.trim(),
        meeting_date: meetingDate || null,
        meeting_type: meetingType,
        minutes_url,
        is_visible: isVisible,
      });
      if (insErr) throw insErr;
    },
    onSuccess: () => {
      setTitle(""); setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setTimeout(() => setProgress(0), 800);
      qc.invalidateQueries({ queryKey: ["admin", "assembly_meetings"] });
    },
    onError: () => setProgress(0),
  });

  const delMut = useMutation({
    mutationFn: async (m: Meeting) => {
      if (m.minutes_url) {
        const marker = `/storage/v1/object/public/${BUCKET}/`;
        const idx = m.minutes_url.indexOf(marker);
        if (idx !== -1) {
          const path = decodeURIComponent(m.minutes_url.slice(idx + marker.length));
          await supabase.storage.from(BUCKET).remove([path]);
        }
      }
      const { error } = await supabase.from("assembly_meetings").delete().eq("id", m.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "assembly_meetings"] }),
  });

  const toggleVisible = useMutation({
    mutationFn: async (m: Meeting) => {
      const { error } = await supabase
        .from("assembly_meetings")
        .update({ is_visible: !m.is_visible })
        .eq("id", m.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "assembly_meetings"] }),
  });

  return (
    <div className="space-y-8" dir="rtl">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="text-xs font-bold text-muted-foreground">إجمالي الاجتماعات</div>
          <div className="mt-1 text-2xl font-extrabold text-primary">{counts.total}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-bold text-emerald-700">عادية</div>
          <div className="mt-1 text-2xl font-extrabold text-emerald-700">{counts["عادية"]}</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-xs font-bold text-amber-700">غير عادية</div>
          <div className="mt-1 text-2xl font-extrabold text-amber-700">{counts["غير عادية"]}</div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="border-b border-border bg-gradient-to-l from-primary/5 to-transparent px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-primary">
            <CalendarCheck className="h-5 w-5" /> إضافة اجتماع جديد
          </h3>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); uploadMut.mutate(); }} className="grid gap-5 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-bold">عنوان الاجتماع *</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              placeholder="مثال: الاجتماع السنوي الثالث للجمعية العمومية"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">تاريخ الاجتماع *</label>
            <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} required
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">نوع الاجتماع *</label>
            <select value={meetingType} onChange={(e) => setMeetingType(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold">محضر الاجتماع (PDF - اختياري)</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                isDragging ? "border-primary bg-primary/5"
                  : file ? "border-primary/60 bg-primary/5"
                  : "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <input ref={fileRef} type="file" accept="application/pdf,.pdf"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)} className="hidden" />
              {file ? (
                <>
                  <FileText className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-bold text-primary">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-destructive shadow-sm hover:bg-destructive/10">
                    <X className="h-3 w-3" /> إزالة
                  </button>
                </>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-bold">اسحب وأفلت محضر الاجتماع هنا</p>
                    <p className="mt-1 text-xs text-muted-foreground">أو انقر للاختيار · PDF فقط</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)}
                className="h-5 w-5 accent-primary" />
              ظاهر للجمهور
            </label>
          </div>

          {progress > 0 && (
            <div className="md:col-span-2">
              <div className="mb-1 flex justify-between text-xs font-bold text-muted-foreground">
                <span>جاري الرفع...</span><span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {uploadMut.error && (
            <p className="md:col-span-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {(uploadMut.error as Error).message}
            </p>
          )}

          <div className="md:col-span-2">
            <button type="submit" disabled={uploadMut.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50">
              {uploadMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              حفظ الاجتماع
            </button>
          </div>
        </form>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-extrabold">
          الاجتماعات <span className="text-sm font-normal text-muted-foreground">({data?.length ?? 0})</span>
        </h3>
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : error ? (
            <div className="p-6 text-sm text-destructive">خطأ: {(error as Error).message}</div>
          ) : !data || data.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">لا توجد اجتماعات بعد.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-right font-bold">العنوان</th>
                  <th className="px-4 py-3 text-right font-bold">التاريخ</th>
                  <th className="px-4 py-3 text-right font-bold">النوع</th>
                  <th className="px-4 py-3 text-right font-bold">المحضر</th>
                  <th className="px-4 py-3 text-right font-bold w-40">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data.map((m) => {
                  const isExtra = (m.meeting_type ?? "").includes("غير");
                  return (
                    <tr key={m.id} className="border-t border-border">
                      <td className="px-4 py-3 font-bold">{m.title || "—"}</td>
                      <td className="px-4 py-3">{m.meeting_date ? String(m.meeting_date).slice(0, 10) : "—"}</td>
                      <td className="px-4 py-3">
                        {m.meeting_type && (
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${
                            isExtra ? "border-amber-200 bg-amber-50 text-amber-700"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                          }`}>{m.meeting_type}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {m.minutes_url ? (
                          <a href={m.minutes_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline">
                            <FileText className="h-4 w-4" /> عرض <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleVisible.mutate(m)}
                            className={`rounded p-1.5 ${m.is_visible ? "text-emerald-700 hover:bg-emerald-50" : "text-muted-foreground hover:bg-muted"}`}
                            aria-label="تبديل الظهور"
                            title={m.is_visible ? "ظاهر" : "مخفي"}
                          >
                            {m.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => { if (confirm("حذف هذا الاجتماع؟")) delMut.mutate(m); }}
                            className="rounded p-1.5 text-destructive hover:bg-destructive/10"
                            aria-label="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
