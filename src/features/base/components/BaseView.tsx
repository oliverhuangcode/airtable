"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { TableGrid } from "./TableGrid";
import { TableTabs } from "./TableTabs";
import { Toolbar } from "./Toolbar";
import { Loader2, AlertCircle } from "lucide-react";
import type { Filter, Sort, FieldSummary } from "~/types";

interface Props {
  baseId: string;
}

function parseJSON<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str) as T; }
  catch { return fallback; }
}

export function BaseView({ baseId }: Props) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  // ── Read URL state once per render — stable references via useMemo ────────
  const activeTableId = searchParams.get("tableId");
  const search        = searchParams.get("search") ?? "";
  const filters       = useMemo<Filter[]>(
    () => parseJSON(searchParams.get("filters"), []),
    [searchParams.get("filters")],
  );
  const sorts         = useMemo<Sort[]>(
    () => parseJSON(searchParams.get("sorts"), []),
    [searchParams.get("sorts")],
  );

  const [hiddenFieldIds, setHiddenFieldIds] = useState<string[]>([]);

  // ── Stable URL updater — uses useCallback so effects don't re-fire ────────
  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      // read current params fresh inside the callback to avoid stale closure
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "" || value === "[]") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [pathname, router],
  );

  // ── READ: base with tables + fields ──────────────────────────────────────
  const { data: base, isLoading, error } = api.base.getById.useQuery({ id: baseId });

  // auto-select first table only if nothing in URL yet
  useEffect(() => {
    if (!activeTableId && base?.tables[0]) {
      updateParams({ tableId: base.tables[0].id });
    }
  }, [base?.tables[0]?.id, activeTableId, updateParams]);

  // reset hidden fields when switching tables
  useEffect(() => {
    setHiddenFieldIds([]);
  }, [activeTableId]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeTable    = base?.tables.find((t) => t.id === activeTableId);
  const visibleFields: FieldSummary[] = useMemo(
    () => (activeTable?.fields ?? []).filter((f) => !hiddenFieldIds.includes(f.id)),
    [activeTable?.fields, hiddenFieldIds],
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
          updateParams({ tableId: id, search: null, filters: null, sorts: null });
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
          onSearchChange={(v) => updateParams({ search: v })}
          onFiltersChange={(v) => updateParams({ filters: JSON.stringify(v) })}
          onSortsChange={(v) => updateParams({ sorts: JSON.stringify(v) })}
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