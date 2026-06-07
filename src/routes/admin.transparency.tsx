import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, Trash2, FileText, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/transparency")({
  component: AdminTransparencyPage,
});

const BUCKET = "documents";

const CATEGORIES = [
  "التأسيس والترخيص",
  "الحوكمة والهيكل التنظيمي",
  "الشفافية المالية",
  "التقارير السنوية والأداء",
  "الجمعية العمومية",
  "السياسات والأنظمة",
  "نماذج الإفصاح الرسمي",
] as const;

type Doc = {
  id: string;
  title: string;
  category: string | null;
  file_url: string | null;
  published_at: string | null;
  is_visible: boolean | null;
  created_at: string;
};

function AdminTransparencyPage() {
  return (
    <AdminShell title="الوثائق والسياسات">
      <TransparencyManager />
    </AdminShell>
  );
}

function TransparencyManager() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [publishedAt, setPublishedAt] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [isVisible, setIsVisible] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [lastUploadedName, setLastUploadedName] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "policy_documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("policy_documents")
        .select("id,title,category,file_url,published_at,is_visible,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Doc[];
    },
  });

  const uploadMut = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("الرجاء اختيار ملف PDF");
      if (!title.trim()) throw new Error("الرجاء إدخال العنوان");
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        throw new Error("يجب أن يكون الملف من نوع PDF");
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: "application/pdf", upsert: false });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const file_url = pub.publicUrl;

      const { error: insErr } = await supabase.from("policy_documents").insert({
        title: title.trim(),
        category,
        file_url,
        published_at: publishedAt || null,
        is_visible: isVisible,
      });
      if (insErr) throw insErr;

      return file.name;
    },
    onSuccess: (name) => {
      setLastUploadedName(name);
      setFile(null);
      setTitle("");
      if (fileRef.current) fileRef.current.value = "";
      qc.invalidateQueries({ queryKey: ["admin", "policy_documents"] });
    },
  });

  const delMut = useMutation({
    mutationFn: async (doc: Doc) => {
      if (doc.file_url) {
        const marker = `/storage/v1/object/public/${BUCKET}/`;
        const idx = doc.file_url.indexOf(marker);
        if (idx !== -1) {
          const path = decodeURIComponent(doc.file_url.slice(idx + marker.length));
          await supabase.storage.from(BUCKET).remove([path]);
        }
      }
      const { error } = await supabase.from("policy_documents").delete().eq("id", doc.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "policy_documents"] }),
  });

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-white p-6">
        <h3 className="mb-4 text-lg font-extrabold">رفع وثيقة جديدة</h3>
        <form
          onSubmit={(e) => { e.preventDefault(); uploadMut.mutate(); }}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-bold">العنوان *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">التصنيف *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">تاريخ النشر</label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-bold">ملف PDF *</label>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            {file && (
              <p className="mt-1 text-xs text-muted-foreground">
                المحدد: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="h-5 w-5"
              />
              مرئي للجمهور
            </label>
          </div>

          {uploadMut.error && (
            <p className="md:col-span-2 text-sm text-destructive">
              {(uploadMut.error as Error).message}
            </p>
          )}
          {lastUploadedName && !uploadMut.isPending && (
            <p className="md:col-span-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              ✓ تم رفع الملف بنجاح: <strong>{lastUploadedName}</strong>
            </p>
          )}

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={uploadMut.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {uploadMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              رفع الوثيقة
            </button>
          </div>
        </form>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-extrabold">الوثائق المرفوعة</h3>
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : error ? (
            <div className="p-6 text-sm text-destructive">خطأ: {(error as Error).message}</div>
          ) : !data || data.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">لا توجد وثائق بعد.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-right font-bold">العنوان</th>
                  <th className="px-4 py-3 text-right font-bold">التصنيف</th>
                  <th className="px-4 py-3 text-right font-bold">تاريخ النشر</th>
                  <th className="px-4 py-3 text-right font-bold">الحالة</th>
                  <th className="px-4 py-3 text-right font-bold w-32">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-medium">{d.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{d.category ?? "—"}</td>
                    <td className="px-4 py-3">{d.published_at ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-1 text-xs font-bold ${d.is_visible ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                        {d.is_visible ? "مرئي" : "مخفي"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {d.file_url && (
                          <a
                            href={d.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 text-primary hover:bg-primary/10"
                            aria-label="فتح"
                          ><ExternalLink className="h-4 w-4" /></a>
                        )}
                        <button
                          onClick={() => { if (confirm("حذف هذه الوثيقة؟")) delMut.mutate(d); }}
                          className="rounded p-1.5 text-destructive hover:bg-destructive/10"
                          aria-label="حذف"
                        ><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
