import type { Sort, FieldSummary } from "~/types";
import { Plus, X } from "lucide-react";
import { Panel } from "./Panel";

interface SortPanelProps {
  fields:   FieldSummary[];
  sorts:    Sort[];
  onChange: (sorts: Sort[]) => void;
  onClose:  () => void;
}

export function SortPanel({ fields, sorts, onChange, onClose }: SortPanelProps) {
  const addSort = () => {
    const field = fields[0];
    if (!field) return;
    onChange([
      ...sorts,
      { fieldId: field.id, fieldType: field.type, direction: "asc" },
    ]);
  };

  const removeSort = (i: number) => onChange(sorts.filter((_, idx) => idx !== i));

  const updateSort = (i: number, patch: Partial<Sort>) => {
    onChange(sorts.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };

  const changeField = (i: number, fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;
    updateSort(i, { fieldId, fieldType: field.type });
  };

  return (
    <Panel title="Sort" onClose={onClose}>
      {sorts.length === 0 && (
        <p className="mb-3 text-xs text-[#999]">No sorts applied</p>
      )}
      <div className="space-y-2">
        {sorts.map((sort, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={sort.fieldId}
              onChange={(e) => changeField(i, e.target.value)}
              className="rounded border border-[#e0e0e0] px-2 py-1 text-xs outline-none focus:border-[#1170cb]"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <select
              value={sort.direction}
              onChange={(e) =>
                updateSort(i, { direction: e.target.value as "asc" | "desc" })
              }
              className="rounded border border-[#e0e0e0] px-2 py-1 text-xs outline-none focus:border-[#1170cb]"
            >
              <option value="asc">
                {sort.fieldType === "NUMBER" ? "1 → 9" : "A → Z"}
              </option>
              <option value="desc">
                {sort.fieldType === "NUMBER" ? "9 → 1" : "Z → A"}
              </option>
            </select>
            <button onClick={() => removeSort(i)} className="text-[#999] hover:text-red-500">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addSort}
        className="mt-3 flex items-center gap-1 text-xs text-[#1170cb] hover:underline"
      >
        <Plus className="h-3 w-3" />
        Add sort
      </button>
    </Panel>
  );
}