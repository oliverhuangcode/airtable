"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { TableGrid } from "./TableGrid";
import { TableTabs } from "./TableTabs";
import { Toolbar } from "./Toolbar";
import { Loader2, AlertCircle } from "lucide-react";
import type { Filter, Sort } from "~/types";

interface Props {
  baseId: string;
}

export function BaseView({ baseId }: Props) {
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sorts, setSorts] = useState<Sort[]>([]);
  const [hiddenFieldIds, setHiddenFieldIds] = useState<string[]>([]);

  // ── READ: base with tables + fields ──────────────────────────────────────
  const { data: base, isLoading, error } = api.base.getById.useQuery({ id: baseId });

  // onSuccess was removed in TanStack Query v5 — use useEffect to auto-select
  useEffect(() => {
    if (!activeTableId && base?.tables[0]) {
      setActiveTableId(base.tables[0].id);
    }
  }, [base, activeTableId]);

  const activeTable = base?.tables.find((t) => t.id === activeTableId);
  const visibleFields = (activeTable?.fields ?? []).filter(
    (f: { id: string }) => !hiddenFieldIds.includes(f.id),
  );

  // ── LOADING / ERROR ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-5 w-5 animate-spin text-[#1170cb]" />
      </div>
    );
  }

  if (error || !base) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">Failed to load base</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Top nav */}
      <div className="flex h-[56px] flex-shrink-0 items-center border-b border-[#e0e0e0] px-4">
        <span className="text-sm font-semibold text-[#1f1f1f]">{base.name}</span>
      </div>

      {/* Table tabs */}
      <TableTabs
        baseId={baseId}
        tables={base.tables}
        activeTableId={activeTableId}
        onSelectTable={(id) => {
          setActiveTableId(id);
          setSearch("");
          setFilters([]);
          setSorts([]);
          setHiddenFieldIds([]);
        }}
      />

      {/* Toolbar */}
      {activeTableId && activeTable && (
        <Toolbar
          tableId={activeTableId}
          fields={activeTable.fields}
          search={search}
          filters={filters}
          sorts={sorts}
          hiddenFieldIds={hiddenFieldIds}
          onSearchChange={setSearch}
          onFiltersChange={setFilters}
          onSortsChange={setSorts}
          onHiddenFieldsChange={setHiddenFieldIds}
        />
      )}

      {/* Grid */}
      {activeTableId && activeTable && (
        <div className="flex-1 overflow-hidden">
          <TableGrid
            tableId={activeTableId}
            fields={visibleFields}
            allFields={activeTable.fields}
            search={search}
            filters={filters}
            sorts={sorts}
          />
        </div>
      )}
    </div>
  );
}