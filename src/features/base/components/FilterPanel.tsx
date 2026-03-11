"use client";

import { Plus, X } from "lucide-react";
import type { FieldSummary, Filter, TextFilter, NumberFilter } from "~/types";
import { Panel } from "./Panel";


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
  const addFilter = () => {
    const field = fields[0];
    if (!field) return;
    const newFilter: Filter =
      field.type === "NUMBER"
        ? { type: "number", fieldId: field.id, op: "gt", value: 0 }
        : { type: "text",   fieldId: field.id, op: "contains", value: "" };
    onChange([...filters, newFilter]);
  };

  const removeFilter = (i: number) => {
    onChange(filters.filter((_, idx) => idx !== i));
  };

  const updateFilter = (i: number, patch: Partial<Filter>) => {
    onChange(
      filters.map((f, idx) =>
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
    onChange(filters.map((f, idx) => (idx === i ? newFilter : f)));
  };

  return (
    <Panel title="Filter" onClose={onClose}>
      {filters.length === 0 && (
        <p className="mb-3 text-xs text-[#999]">No filters applied</p>
      )}
      <div className="space-y-2">
        {filters.map((filter, i) => {
          const field = fields.find((f) => f.id === filter.fieldId);
          const ops   = filter.type === "number" ? NUMBER_OPS : TEXT_OPS;
          const needsValue = filter.type === "text"
            ? !["is_empty", "is_not_empty"].includes(filter.op)
            : true;

          return (
            <div key={i} className="flex items-center gap-2">
              {/* Field select */}
              <select
                value={filter.fieldId}
                onChange={(e) => changeField(i, e.target.value)}
                className="rounded border border-[#e0e0e0] px-2 py-1 text-xs outline-none focus:border-[#1170cb]"
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              {/* Op select */}
              <select
                value={filter.op}
                onChange={(e) =>
                  updateFilter(i, { op: e.target.value as never })
                }
                className="rounded border border-[#e0e0e0] px-2 py-1 text-xs outline-none focus:border-[#1170cb]"
              >
                {ops.map((op) => (
                  <option key={op} value={op}>{OP_LABELS[op]}</option>
                ))}
              </select>

              {/* Value input */}
              {needsValue && (
                filter.type === "number" ? (
                  <input
                    type="number"
                    value={(filter).value}
                    onChange={(e) =>
                      updateFilter(i, { value: parseFloat(e.target.value) || 0 })
                    }
                    className="w-20 rounded border border-[#e0e0e0] px-2 py-1 text-xs outline-none focus:border-[#1170cb]"
                  />
                ) : (
                  <input
                    type="text"
                    value={(filter).value ?? ""}
                    onChange={(e) =>
                      updateFilter(i, { value: e.target.value })
                    }
                    placeholder="value..."
                    className="w-28 rounded border border-[#e0e0e0] px-2 py-1 text-xs outline-none focus:border-[#1170cb]"
                  />
                )
              )}

              <button onClick={() => removeFilter(i)} className="text-[#999] hover:text-red-500">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
      <button
        onClick={addFilter}
        className="mt-3 flex items-center gap-1 text-xs text-[#1170cb] hover:underline"
      >
        <Plus className="h-3 w-3" />
        Add filter
      </button>
    </Panel>
  );
}
