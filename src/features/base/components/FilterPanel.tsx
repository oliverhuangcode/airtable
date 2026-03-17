"use client";

import { useState } from "react";
import { Plus, HelpCircle, Trash2, MoreVertical } from "lucide-react";
import type { FieldSummary, Filter } from "~/types";

interface Props {
  fields:   FieldSummary[];
  filters:  Filter[];
  onChange: (filters: Filter[]) => void;
  onClose:  () => void;
}

const TEXT_OPS   = ["contains", "not_contains", "equals", "is_empty", "is_not_empty"] as const;
const NUMBER_OPS = ["gt", "lt", "equals"] as const;

const OP_LABELS: Record<string, string> = {
  contains:     "contains",
  not_contains: "does not contain",
  equals:       "is",
  is_empty:     "is empty",
  is_not_empty: "is not empty",
  gt:           "greater than",
  lt:           "less than",
};

export function FilterPanel({ fields, filters, onChange, onClose }: Props) {
  const [draft, setDraft] = useState<Filter[]>(filters);

  const addFilter = () => {
    const field = fields[0];
    if (!field) return;
    const newFilter: Filter =
      field.type === "NUMBER"
        ? { type: "number", fieldId: field.id, op: "gt", value: 0 }
        : { type: "text",   fieldId: field.id, op: "contains", value: "" };
    setDraft([...draft, newFilter]);
  };

  const removeFilter = (i: number) => {
    setDraft(draft.filter((_, idx) => idx !== i));
  };

  const updateFilter = (i: number, patch: Partial<Filter>) => {
    setDraft(
      draft.map((f, idx) =>
        idx === i ? ({ ...f, ...patch } as Filter) : f,
      ),
    );
  };

  const changeField = (i: number, fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;
    const newFilter: Filter =
      field.type === "NUMBER"
        ? { type: "number", fieldId, op: "gt", value: 0 }
        : { type: "text",   fieldId, op: "contains", value: "" };
    setDraft(draft.map((f, idx) => (idx === i ? newFilter : f)));
  };

  const handleApply = () => {
    onChange(draft);
    onClose();
  };

  return (
    <div className={`absolute right-0 top-full z-30 mt-1 rounded-lg border border-[#ddd] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] ${
      draft.length > 0 ? "w-[580px]" : "w-[380px]"
    }`}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="text-[14px] font-semibold text-[#1f1f1f]">Filter</h3>
      </div>

      {/* AI description bar */}
      <div className="mx-4 mb-3 flex items-center gap-2 rounded-md border border-[#ddd] px-3 py-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#bbb]">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
        </svg>
        <span className="text-[13px] text-[#999]">Describe what you want to see</span>
      </div>

      {/* Body */}
      <div className="px-4 pb-3">
        {draft.length === 0 ? (
          <div className="flex items-center gap-1.5 py-1 text-[13px] text-[#888]">
            <span>No filter conditions are applied</span>
            <HelpCircle className="h-3.5 w-3.5 text-[#bbb]" />
          </div>
        ) : (
          <>
            <div className="mb-2 text-[13px] text-[#888]">In this view, show records</div>
            <div className="space-y-2">
              {draft.map((filter, i) => {
                const ops = filter.type === "number" ? NUMBER_OPS : TEXT_OPS;
                const needsValue = filter.type === "text"
                  ? !["is_empty", "is_not_empty"].includes(filter.op)
                  : true;

                return (
                  <div key={i} className="flex items-center gap-2">
                    {i === 0 && <span className="w-[52px] shrink-0 text-[13px] text-[#666]">Where</span>}
                    {i > 0 && (
                      <select className="w-[52px] shrink-0 rounded border border-[#ddd] px-1 py-1.5 text-[13px] text-[#666] outline-none">
                        <option>and</option>
                        <option>or</option>
                      </select>
                    )}
                    <select
                      value={filter.fieldId}
                      onChange={(e) => changeField(i, e.target.value)}
                      className="min-w-[100px] flex-1 rounded border border-[#ddd] px-2 py-1.5 text-[13px] outline-none focus:border-[#2d7ff9]"
                    >
                      {fields.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                    <select
                      value={filter.op}
                      onChange={(e) => updateFilter(i, { op: e.target.value as never })}
                      className="rounded border border-[#ddd] px-2 py-1.5 text-[13px] outline-none focus:border-[#2d7ff9]"
                    >
                      {ops.map((op) => (
                        <option key={op} value={op}>{OP_LABELS[op]}</option>
                      ))}
                    </select>
                    {needsValue && (
                      filter.type === "number" ? (
                        <input
                          type="number"
                          value={filter.value}
                          onChange={(e) => updateFilter(i, { value: parseFloat(e.target.value) || 0 })}
                          className="w-24 rounded border border-[#ddd] px-2 py-1.5 text-[13px] outline-none focus:border-[#2d7ff9]"
                        />
                      ) : (
                        <input
                          type="text"
                          value={filter.value ?? ""}
                          onChange={(e) => updateFilter(i, { value: e.target.value })}
                          placeholder="Enter a value"
                          className="w-28 rounded border border-[#ddd] px-2 py-1.5 text-[13px] outline-none focus:border-[#2d7ff9] placeholder:text-[#999]"
                        />
                      )
                    )}
                    <button onClick={() => removeFilter(i)} className="rounded p-1 text-[#bbb] hover:bg-[#f0f0f0] hover:text-[#666]">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded p-1 text-[#bbb] hover:bg-[#f0f0f0] hover:text-[#666]">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Add condition row */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={addFilter}
            className="flex items-center gap-1 text-[13px] text-[#2d7ff9] hover:text-[#1a6ed8]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add condition</span>
          </button>
          <button className="flex items-center gap-1 text-[13px] text-[#666] hover:text-[#444]">
            <Plus className="h-3.5 w-3.5" />
            <span>Add condition group</span>
          </button>
          <HelpCircle className="h-3.5 w-3.5 text-[#bbb]" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3">
        <button
          onClick={onClose}
          className="rounded-md px-4 py-1.5 text-[13px] font-medium text-[#333] hover:bg-[#f0f0f0]"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="rounded-md bg-[#2d7ff9] px-5 py-1.5 text-[13px] font-medium text-white hover:bg-[#1a6ed8]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
