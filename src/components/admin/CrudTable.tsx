import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select";
export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
};

type Row = Record<string, any> & { id: string };

export function CrudTable({
  table,
  fields,
  listColumns,
  orderBy = "created_at",
  ascending = false,
  readOnly = false,
  emptyText = "لا توجد بيانات بعد.",
  defaults = {},
}: {
  table: string;
  fields: FieldDef[];
  listColumns: { key: string; label: string; render?: (row: Row) => ReactNode }[];
  orderBy?: string;
  ascending?: boolean;
  readOnly?: boolean;
  emptyText?: string;
  defaults?: Record<string, any>;
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const queryKey = ["admin", table];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderBy, { ascending });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const upsertMut = useMutation({
    mutationFn: async (payload: Row) => {
      if (payload.id) {
        const { id, ...rest } = payload;
        const { error } = await supabase.from(table).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { id: _ignore, ...rest } = payload;
        const { error } = await supabase.from(table).insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      setEditing(null);
      setCreating(false);
    },
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const formRow = creating ? ({ ...defaults } as Row) : editing;

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex justify-end">
          <button
            onClick={() => { setCreating(true); setEditing(null); }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> إضافة
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">خطأ: {(error as Error).message}</div>
        ) : !data || data.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">{emptyText}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {listColumns.map((c) => (
                  <th key={c.key} className="px-4 py-3 text-right font-bold">{c.label}</th>
                ))}
                {!readOnly && <th className="px-4 py-3 text-right font-bold w-32">إجراءات</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  {listColumns.map((c) => (
                    <td key={c.key} className="px-4 py-3">
                      {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                    </td>
                  ))}
                  {!readOnly && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditing(row); setCreating(false); }}
                          className="rounded p-1.5 text-primary hover:bg-primary/10"
                          aria-label="تعديل"
                        ><Pencil className="h-4 w-4" /></button>
                        <button
                          onClick={() => {
                            if (confirm("هل تريد حذف هذا العنصر؟")) delMut.mutate(row.id);
                          }}
                          className="rounded p-1.5 text-destructive hover:bg-destructive/10"
                          aria-label="حذف"
                        ><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {formRow && !readOnly && (
        <EditDialog
          row={formRow}
          fields={fields}
          isCreate={creating}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(payload) => upsertMut.mutate(payload)}
          saving={upsertMut.isPending}
          error={upsertMut.error as Error | null}
        />
      )}
    </div>
  );
}

function EditDialog({
  row, fields, isCreate, onClose, onSave, saving, error,
}: {
  row: Row;
  fields: FieldDef[];
  isCreate: boolean;
  onClose: () => void;
  onSave: (row: Row) => void;
  saving: boolean;
  error: Error | null;
}) {
  const [form, setForm] = useState<Row>(row);
  const update = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold">{isCreate ? "إضافة جديدة" : "تعديل"}</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); onSave(form); }}
          className="space-y-4"
        >
          {fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-sm font-bold">{f.label}{f.required && " *"}</label>
              {f.type === "textarea" ? (
                <textarea
                  value={form[f.key] ?? ""}
                  onChange={(e) => update(f.key, e.target.value)}
                  required={f.required}
                  placeholder={f.placeholder}
                  rows={4}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              ) : f.type === "boolean" ? (
                <input
                  type="checkbox"
                  checked={!!form[f.key]}
                  onChange={(e) => update(f.key, e.target.checked)}
                  className="h-5 w-5"
                />
              ) : f.type === "number" ? (
                <input
                  type="number"
                  value={form[f.key] ?? ""}
                  onChange={(e) => update(f.key, e.target.value === "" ? null : Number(e.target.value))}
                  required={f.required}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              ) : f.type === "select" ? (
                <select
                  value={form[f.key] ?? ""}
                  onChange={(e) => update(f.key, e.target.value)}
                  required={f.required}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <option value="">اختر...</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={form[f.key] ?? ""}
                  onChange={(e) => update(f.key, e.target.value)}
                  required={f.required}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              )}
            </div>
          ))}
          {error && <p className="text-sm text-destructive">{error.message}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-bold">
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
