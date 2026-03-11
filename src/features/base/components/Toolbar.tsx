"use client";

import { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, Eye, X } from "lucide-react";
import type { FieldSummary, Filter, Sort } from "~/types";
import { FilterPanel } from "./FilterPanel";
import { SortPanel } from "./SortPanel";
import { HideFieldsPanel } from "./HideFieldsPanel";

interface Props {
  tableId:              string;
  fields:               FieldSummary[];
  search:               string;
  filters:              Filter[];
  sorts:                Sort[];
  hiddenFieldIds:       string[];
  onSearchChange:       (v: string) => void;
  onFiltersChange:      (v: Filter[]) => void;
  onSortsChange:        (v: Sort[]) => void;
  onHiddenFieldsChange: (v: string[]) => void;
}

export function Toolbar({
  fields,
  search,
  filters,
  sorts,
  hiddenFieldIds,
  onSearchChange,
  onFiltersChange,
  onSortsChange,
  onHiddenFieldsChange,
}: Props) {
  const [openPanel, setOpenPanel]   = useState<"filter" | "sort" | "hide" | null>(null);
  const [localSearch, setLocalSearch] = useState(search);

  // Track whether the change came from the user typing or from parent sync
  const isUserInput = useRef(false);

  // Stable ref so debounce always calls the latest callback
  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => { onSearchChangeRef.current = onSearchChange; }, [onSearchChange]);

  // Sync local value when parent search changes externally (table switch, URL change)
  // Mark as NOT user input so debounce doesn't fire
  useEffect(() => {
    isUserInput.current = false;
    setLocalSearch(search);
  }, [search]);

  // Debounce — only fires when the user typed something
  useEffect(() => {
    if (!isUserInput.current) return;
    const timer = setTimeout(() => {
      onSearchChangeRef.current(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const handleSearchChange = (value: string) => {
    isUserInput.current = true;
    setLocalSearch(value);
  };

  const handleSearchClear = () => {
    isUserInput.current = false;
    setLocalSearch("");
    onSearchChangeRef.current("");
  };

  const toggle = (panel: "filter" | "sort" | "hide") =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  return (
    <div className="relative flex-shrink-0 border-b border-[#e0e0e0] bg-white">
      <div className="flex h-[44px] items-center gap-1 px-4">
        {/* Search */}
        <div className="flex items-center gap-1.5 rounded border border-transparent bg-[#f4f4f4] px-2.5 py-1.5 hover:border-[#d0d0d0] focus-within:border-[#1170cb] focus-within:bg-white transition-colors">
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-[#999]" />
          <input
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-36 bg-transparent text-xs text-[#1f1f1f] outline-none placeholder:text-[#999]"
          />
          {localSearch && (
            <button onClick={handleSearchClear}>
              <X className="h-3 w-3 text-[#999] hover:text-[#666]" />
            </button>
          )}
        </div>

        <div className="mx-2 h-4 w-px bg-[#e0e0e0]" />

        <ToolbarButton
          icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          label="Filter"
          active={openPanel === "filter"}
          badge={filters.length > 0 ? filters.length : undefined}
          onClick={() => toggle("filter")}
        />
        <ToolbarButton
          icon={<ArrowUpDown className="h-3.5 w-3.5" />}
          label="Sort"
          active={openPanel === "sort"}
          badge={sorts.length > 0 ? sorts.length : undefined}
          onClick={() => toggle("sort")}
        />
        <ToolbarButton
          icon={<Eye className="h-3.5 w-3.5" />}
          label="Hide"
          active={openPanel === "hide"}
          badge={hiddenFieldIds.length > 0 ? hiddenFieldIds.length : undefined}
          onClick={() => toggle("hide")}
        />
      </div>

      {openPanel === "filter" && (
        <FilterPanel fields={fields} filters={filters} onChange={onFiltersChange} onClose={() => setOpenPanel(null)} />
      )}
      {openPanel === "sort" && (
        <SortPanel fields={fields} sorts={sorts} onChange={onSortsChange} onClose={() => setOpenPanel(null)} />
      )}
      {openPanel === "hide" && (
        <HideFieldsPanel fields={fields} hiddenFieldIds={hiddenFieldIds} onChange={onHiddenFieldsChange} onClose={() => setOpenPanel(null)} />
      )}
    </div>
  );
}

function ToolbarButton({ icon, label, active, badge, onClick }: {
  icon: React.ReactNode; label: string; active: boolean; badge?: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-[#e8f0fe] text-[#1170cb]" : "text-[#666] hover:bg-[#f4f4f4] hover:text-[#1f1f1f]"
      }`}
    >
      {icon}
      {label}
      {badge !== undefined && (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1170cb] text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}