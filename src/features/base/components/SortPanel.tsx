"use client";

import { useState } from "react";
import { Search, X, Plus, HelpCircle } from "lucide-react";
import type { Sort, FieldSummary } from "~/types";

interface SortPanelProps {
  fields: FieldSummary[];
  sorts: Sort[];
  onChange: (sorts: Sort[]) => void;
  onClose: () => void;
}

function FieldTypeIcon({ type }: { type: string }) {
  if (type === "NUMBER") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0 text-[#666]"
      >
        <text
          x="2"
          y="13"
          fontSize="13"
          fontWeight="600"
          fill="currentColor"
          fontFamily="monospace"
        >
          #
        </text>
      </svg>
    );
  }
  // Text/default - lines icon matching Airtable
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-[#666]"
    >
      <rect x="2" y="3" width="12" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="2" y="7" width="9" height="1.5" rx="0.75" fill="currentColor" />
      <rect
        x="2"
        y="11"
        width="11"
        height="1.5"
        rx="0.75"
        fill="currentColor"
      />
    </svg>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative h-[18px] w-[32px] shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#20c933]" : "bg-[#ccc]"
      }`}
    >
      <span
        className={`absolute top-[2px] left-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[14px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function SortPanel({
  fields,
  sorts,
  onChange,
  onClose: _onClose,
}: SortPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [autoSort, setAutoSort] = useState(true);

  const addSort = (field: FieldSummary) => {
    onChange([
      ...sorts,
      { fieldId: field.id, fieldType: field.type, direction: "asc" },
    ]);
    setShowAddPicker(false);
  };

  const removeSort = (i: number) =>
    onChange(sorts.filter((_, idx) => idx !== i));

  const updateSort = (i: number, patch: Partial<Sort>) => {
    onChange(sorts.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };

  const filteredFields = fields.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // If sorts exist, show the applied sorts view
  if (sorts.length > 0) {
    return (
      <div className="absolute top-full right-0 z-30 mt-1 w-[460px] rounded-lg border border-[#ddd] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        {/* Header */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[14px] font-medium text-[#1f1f1f]">Sort by</h3>
            <HelpCircle className="h-3.5 w-3.5 text-[#bbb]" />
          </div>
        </div>

        <div className="mx-4 border-t border-[#eee]" />

        {/* Sort rows */}
        <div className="space-y-2 px-4 py-3">
          {sorts.map((sort, i) => {
            const field = fields.find((f) => f.id === sort.fieldId);
            return (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={sort.fieldId}
                  onChange={(e) => {
                    const f = fields.find((f) => f.id === e.target.value);
                    if (f) updateSort(i, { fieldId: f.id, fieldType: f.type });
                  }}
                  className="flex-1 rounded border border-[#ddd] bg-white px-3 py-1.5 text-[13px] outline-none focus:border-[#2d7ff9]"
                >
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <select
                  value={sort.direction}
                  onChange={(e) =>
                    updateSort(i, {
                      direction: e.target.value as "asc" | "desc",
                    })
                  }
                  className="rounded border border-[#ddd] bg-white px-3 py-1.5 text-[13px] outline-none focus:border-[#2d7ff9]"
                >
                  <option value="asc">
                    {field?.type === "NUMBER" ? "1 → 9" : "A → Z"}
                  </option>
                  <option value="desc">
                    {field?.type === "NUMBER" ? "9 → 1" : "Z → A"}
                  </option>
                </select>
                <button
                  onClick={() => removeSort(i)}
                  className="rounded p-1 text-[#bbb] hover:bg-[#f0f0f0] hover:text-[#666]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add another sort */}
        <div className="relative px-4 pb-3">
          <button
            onClick={() => {
              setShowAddPicker((v) => !v);
              setSearchQuery("");
            }}
            className="flex items-center gap-1.5 text-[13px] text-[#333] hover:text-[#111]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add another sort</span>
          </button>

          {/* Inline field picker */}
          {showAddPicker && (
            <div className="absolute top-full left-4 z-40 mt-1 w-[240px] rounded-lg border border-[#ddd] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <div className="flex items-center gap-2 border-b border-[#eee] px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-[#999]" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find a field"
                  className="w-full bg-transparent text-[13px] text-[#1f1f1f] outline-none placeholder:text-[#999]"
                  autoFocus
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto py-1">
                {filteredFields
                  .filter((f) => !sorts.some((s) => s.fieldId === f.id))
                  .map((field) => (
                    <button
                      key={field.id}
                      onClick={() => addSort(field)}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-[#f5f5f5]"
                    >
                      <FieldTypeIcon type={field.type} />
                      <span className="text-[13px] text-[#1f1f1f]">
                        {field.name}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Auto sort toggle */}
        <div className="flex items-center gap-2.5 rounded-b-lg border-t border-[#eee] bg-[#f8f8f8] px-4 py-3">
          <Toggle checked={autoSort} onChange={() => setAutoSort(!autoSort)} />
          <span className="text-[13px] text-[#333]">
            Automatically sort records
          </span>
        </div>
      </div>
    );
  }

  // No sorts — show field picker dropdown matching Airtable
  return (
    <div className="absolute top-full right-0 z-30 mt-1 w-[280px] rounded-lg border border-[#ddd] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-4 py-3">
        <span className="text-[14px] font-medium text-[#1f1f1f]">Sort by</span>
        <HelpCircle className="h-3.5 w-3.5 text-[#bbb]" />
      </div>

      {/* Search */}
      <div className="border-t border-b border-[#eee]">
        <div className="flex items-center gap-2 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-[#999]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a field"
            className="w-full bg-transparent text-[13px] text-[#1f1f1f] outline-none placeholder:text-[#999]"
            autoFocus
          />
        </div>
      </div>

      {/* Field list */}
      <div className="max-h-[280px] overflow-y-auto py-1">
        {filteredFields.map((field) => (
          <button
            key={field.id}
            onClick={() => {
              addSort(field);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-[#f5f5f5]"
          >
            <FieldTypeIcon type={field.type} />
            <span className="text-[13px] text-[#1f1f1f]">{field.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
