import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, type DragEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Upload,
  Trash2,
  FileText,
  ExternalLink,
  Search,
  UploadCloud,
  X,
  Eye,
  EyeOff,
  Building2,
  Landmark,
  Wallet,
  BarChart3,
  Users,
  ScrollText,
  FileCheck2,
  Folder,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/transparency")({
  component: AdminTransparencyPage,
});

const BUCKET = "documents";

type CategoryDef = {
  name: string;
  icon: typeof Building2;
  color: string; // tailwind classes for badge
};

const CATEGORIES: CategoryDef[] = [
  { name: "التأسيس والترخيص", icon: Building2, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { name: "الحوكمة والهيكل التنظيمي", icon: Landmark, color: "bg-purple-100 text-purple-700 border-purple-200" },
  { name: "الشفافية المالية", icon: Wallet, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { name: "التقارير السنوية والأداء", icon: BarChart3, color: "bg-amber-100 text-amber-700 border-amber-200" },
  { name: "الجمعية العمومية", icon: Users, color: "bg-pink-100 text-pink-700 border-pink-200" },
  { name: "السياسات والأنظمة", icon: ScrollText, color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { name: "نماذج الإفصاح الرسمي", icon: FileCheck2, color: "bg-teal-100 text-teal-700 border-teal-200" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.name, c]));

type Doc = {
  id: string;
  title: string;
  category: string | null;
  file_url: string | null;
  published_at: string | null;
  is_visible: boolean | null;
  description?: string | null;
  created_at: string;
};

function AdminTransparencyPage() {
  return (
    <AdminShell title="الوثائق والسياسات">
      <TransparencyManager />
    </AdminShell>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function TransparencyManager() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0].name);
  const [description, setDescription] = useState("");
  const [publishedAt, setPublishedAt] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [isVisible, setIsVisible] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastUploadedName, setLastUploadedName] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "policy_documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("policy_documents")
        .select("id,title,category,file_url,published_at,is_visible,description,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Doc[];
    },
  });

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of CATEGORIES) m[c.name] = 0;
    (data ?? []).forEach((d) => {
      if (d.category && m[d.category] !== undefined) m[d.category]++;
    });
    return m;
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((d) => {
      if (filterCat && d.category !== filterCat) return false;
      if (q && !d.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, search, filterCat]);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      alert("يجب أن يكون الملف من نوع PDF");
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
      if (!file) throw new Error("الرجاء اختيار ملف PDF");
      if (!title.trim()) throw new Error("الرجاء إدخال العنوان");

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

      // simulated progress (Supabase JS doesn't expose native progress for uploads)
      setProgress(10);
      const tick = setInterval(() => {
        setProgress((p) => (p < 85 ? p + Math.random() * 8 : p));
      }, 200);

      try {
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { contentType: "application/pdf", upsert: false });
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const file_url = pub.publicUrl;

        const insertRow: Record<string, unknown> = {
          title: title.trim(),
          category,
          file_url,
          published_at: publishedAt || null,
          is_visible: isVisible,
        };
        if (description.trim()) insertRow.description = description.trim();

        const { error: insErr } = await supabase.from("policy_documents").insert(insertRow);
        if (insErr) throw insErr;

        setProgress(100);
        return file.name;
      } finally {
        clearInterval(tick);
      }
    },
    onSuccess: (name) => {
      setLastUploadedName(name);
      setFile(null);
      setTitle("");
      setDescription("");
      if (fileRef.current) fileRef.current.value = "";
      setTimeout(() => setProgress(0), 800);
      qc.invalidateQueries({ queryKey: ["admin", "policy_documents"] });
    },
    onError: () => setProgress(0),
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

  const toggleVisible = useMutation({
    mutationFn: async (doc: Doc) => {
      const { error } = await supabase
        .from("policy_documents")
        .update({ is_visible: !doc.is_visible })
        .eq("id", doc.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "policy_documents"] }),
  });

  return (
    <div className="space-y-8" dir="rtl">
      {/* Category counts */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const active = filterCat === c.name;
          return (
            <button
              key={c.name}
              onClick={() => setFilterCat(active ? "" : c.name)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all ${
                active
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-white hover:border-primary/40 hover:shadow-sm"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${c.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-[11px] font-bold leading-tight line-clamp-2">{c.name}</div>
              <div className="text-xs font-extrabold text-primary">{counts[c.name] ?? 0}</div>
            </button>
          );
        })}
      </div>

      {/* Upload form */}
      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="border-b border-border bg-gradient-to-l from-primary/5 to-transparent px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-primary">
            <UploadCloud className="h-5 w-5" />
            رفع وثيقة جديدة
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">قم بسحب وإفلات ملف PDF أو اختياره يدوياً</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); uploadMut.mutate(); }}
          className="grid gap-5 p-6 md:grid-cols-2"
        >
          {/* Drag & drop area */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold">ملف PDF *</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : file
                  ? "border-primary/60 bg-primary/5"
                  : "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              {file ? (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-primary">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-destructive shadow-sm hover:bg-destructive/10"
                  >
                    <X className="h-3 w-3" /> إزالة
                  </button>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <UploadCloud className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">اسحب وأفلت الملف هنا</p>
                    <p className="mt-1 text-xs text-muted-foreground">أو انقر للاختيار · PDF فقط</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-bold">العنوان *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">التصنيف *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>📁 {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">تاريخ النشر</label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-bold">ملاحظات / وصف (اختياري)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="أضف وصفاً أو ملاحظات حول هذه الوثيقة..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="h-5 w-5 accent-primary"
              />
              مرئي للجمهور
            </label>
          </div>

          {progress > 0 && (
            <div className="md:col-span-2">
              <div className="mb-1 flex justify-between text-xs font-bold text-muted-foreground">
                <span>جاري الرفع...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {uploadMut.error && (
            <p className="md:col-span-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {(uploadMut.error as Error).message}
            </p>
          )}
          {lastUploadedName && !uploadMut.isPending && progress === 0 && (
            <p className="md:col-span-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              ✓ تم رفع الملف بنجاح: <strong>{lastUploadedName}</strong>
            </p>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={uploadMut.isPending || !file}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {uploadMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              رفع الوثيقة
            </button>
          </div>
        </form>
      </section>

      {/* Search + filter */}
      <section>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-extrabold">الوثائق المرفوعة <span className="text-sm font-normal text-muted-foreground">({filtered.length})</span></h3>
          <div className="flex flex-1 flex-col gap-2 sm:flex-row md:max-w-2xl md:justify-end">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالعنوان..."
                className="w-full rounded-lg border border-border bg-white py-2 pr-9 pl-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">كل التصنيفات</option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name} ({counts[c.name] ?? 0})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : error ? (
            <div className="p-6 text-sm text-destructive">خطأ: {(error as Error).message}</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-12 text-center text-sm text-muted-foreground">
              <Folder className="h-10 w-10 opacity-40" />
              {search || filterCat ? "لا توجد نتائج مطابقة." : "لا توجد وثائق بعد."}
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((d) => {
                const cat = d.category ? CAT_MAP[d.category] : undefined;
                const Icon = cat?.icon ?? FileText;
                return (
                  <li key={d.id} className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/30 md:flex-row md:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-primary">{d.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {cat ? (
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${cat.color}`}>
                            <Icon className="h-3 w-3" />
                            {cat.name}
                          </span>
                        ) : (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">بدون تصنيف</span>
                        )}
                        {d.published_at && (
                          <span className="text-xs text-muted-foreground">📅 {d.published_at}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Visibility toggle */}
                      <button
                        type="button"
                        onClick={() => toggleVisible.mutate(d)}
                        title={d.is_visible ? "مرئي" : "مخفي"}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          d.is_visible ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform ${
                            d.is_visible ? "-translate-x-0.5" : "-translate-x-5"
                          }`}
                        >
                          {d.is_visible ? <Eye className="h-3 w-3 text-primary" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
                        </span>
                      </button>

                      {d.file_url && (
                        <a
                          href={d.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/5"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> عرض
                        </a>
                      )}
                      <button
                        onClick={() => { if (confirm("حذف هذه الوثيقة؟")) delMut.mutate(d); }}
                        className="inline-flex items-center gap-1 rounded-lg border border-destructive/20 bg-white px-2.5 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> حذف
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
