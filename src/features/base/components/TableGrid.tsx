// src/features/base/components/TableGrid.tsx
"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { api } from "~/trpc/react";
import { Plus, Loader2 } from "lucide-react";
import type { FieldSummary, Filter, Sort, Row } from "~/types";
import { CellEditor } from "./CellEditor";
import { AddColumnButton } from "./AddColumnButton";

const ROW_HEIGHT      = 36;
const COL_WIDTH       = 180;
const INDEX_WIDTH     = 96; // checkbox (32) + row number (64)
const FETCH_LIMIT     = 5000;
const FETCH_THRESHOLD = 0.3;

interface ActiveCell {
  recordId: string;
  fieldId:  string;
  rowIndex: number;
  colIndex: number;
}

interface Props {
  tableId:   string;
  fields:    FieldSummary[];
  allFields?: FieldSummary[];
  search:    string;
  filters:   Filter[];
  sorts:     Sort[];
}

// Field type icon — matches Airtable header icons exactly
function FieldTypeIcon({ type }: { type: string }) {
  if (type === "NUMBER") {
    return (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-[#666]">
        <text x="1" y="13" fontSize="13" fontWeight="600" fill="currentColor" fontFamily="monospace">#</text>
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-[#666]">
      <rect x="2" y="3" width="12" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="2" y="7" width="9" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="2" y="11" width="11" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

// Checkbox — matches Airtable's rounded square style
function Checkbox({ checked, onChange }: { checked: boolean; onChange?: () => void }) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onChange?.(); }}
      className={`h-[15px] w-[15px] flex-shrink-0 cursor-pointer rounded-[3px] border transition-colors ${
        checked
          ? "border-[#1170cb] bg-[#1170cb]"
          : "border-[#c8c8c8] bg-white hover:border-[#a0a0a0]"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 10 8" fill="none" className="h-full w-full p-[2px]">
          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

export function TableGrid({ tableId, fields, allFields: _allFields, search, filters, sorts }: Props) {
  const parentRef             = useRef<HTMLDivElement>(null);
  const [activeCell, setActiveCell]       = useState<ActiveCell | null>(null);
  const [selectedRows, setSelectedRows]   = useState<Set<string>>(new Set());
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const setCellRef = useCallback((recordId: string, fieldId: string, el: HTMLDivElement | null) => {
    const key = `${recordId}:${fieldId}`;
    if (el) cellRefs.current.set(key, el);
    else    cellRefs.current.delete(key);
  }, []);

  const utils = api.useUtils();

  // ── Count: fetched first, sizes the scrollbar immediately ─────────────────
  // This is what keeps the scrollbar stable — virtualizer uses `total` not
  // `allRows.length`, so the scrollbar height never changes as pages load.
  const { data: countData } = api.record.count.useQuery(
    { tableId, filters, search },
    { staleTime: 30_000 },
  );
  const total = countData?.total ?? 0;

  // ── useInfiniteQuery: cursor pagination ───────────────────────────────────
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = api.record.list.useInfiniteQuery(
    { tableId, limit: FETCH_LIMIT, filters, sorts, search },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      staleTime: 60_000,
      // Don't start fetching until we have the total count
      enabled: countData !== undefined,
    },
  );

  const allRows: Row[] = useMemo(
    () => data?.pages.flatMap((p) => p.records) ?? [],
    [data],
  );

  // ── Virtualizer: count = total, never changes ─────────────────────────────
  // Using `total` (from count query) instead of `allRows.length` means:
  // - Scrollbar is full size immediately on load
  // - Scrollbar never jumps or resizes as pages load
  // - User can see exactly where they are in the full dataset
  // Rows beyond allRows.length show as empty (no skeleton, just blank)
  // until the page containing them loads.
  const rowVirtualizer = useVirtualizer({
    count:            total,
    getScrollElement: () => parentRef.current,
    estimateSize:     () => ROW_HEIGHT,
    overscan:         100,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // ── Fetch next page when approaching end of loaded rows ───────────────────
  const lastItemIndex = virtualItems.at(-1)?.index ?? -1;
  useEffect(() => {
    if (lastItemIndex === -1) return;
    const fetchAt = Math.floor(allRows.length * FETCH_THRESHOLD);
    if (lastItemIndex >= fetchAt && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [lastItemIndex, allRows.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Focus active cell ─────────────────────────────────────────────────────
  // Focus active cell
  useEffect(() => {
    if (!activeCell) return;
    const key = `${activeCell.recordId}:${activeCell.fieldId}`;
    requestAnimationFrame(() => {
      const el = cellRefs.current.get(key);
      if (!el) return;
      const inner = el.querySelector<HTMLElement>("[tabindex]");
      inner?.focus({ preventScroll: true });
      const parent = parentRef.current;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      const elRect     = el.getBoundingClientRect();
      if (elRect.bottom > parentRect.bottom) parent.scrollTop += elRect.bottom - parentRect.bottom + 4;
      else if (elRect.top < parentRect.top)  parent.scrollTop -= parentRect.top - elRect.top + 4;
    });
  }, [activeCell]);

  // ── Optimistic cell update ────────────────────────────────────────────────
  const updateCell = api.record.updateCell.useMutation({
    onMutate: async ({ recordId, fieldId, value }) => {
      await utils.record.list.cancel({ tableId });
      const previousData = utils.record.list.getInfiniteData({
        tableId, limit: FETCH_LIMIT, filters, sorts, search,
      });

      utils.record.list.setInfiniteData(
        { tableId, limit: FETCH_LIMIT, filters, sorts, search },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              records: page.records.map((r: Row) =>
                r.id === recordId
                  ? { ...r, data: { ...r.data, [fieldId]: value } }
                  : r,
              ),
            })),
          };
        },
      );
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        utils.record.list.setInfiniteData(
          { tableId, limit: FETCH_LIMIT, filters, sorts, search },
          context.previousData,
        );
      }
    },
  });

  const createRecord = api.record.create.useMutation({
    onSuccess: async () => {
      await utils.record.list.invalidate({ tableId });
      await utils.record.count.invalidate({ tableId });
    },
  });

  const bulkCreate = api.record.bulkCreate.useMutation({
    onSuccess: async () => {
      await utils.record.list.invalidate({ tableId });
      await utils.record.count.invalidate({ tableId });
    },
  });

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      const maxCol = fields.length - 1;
      const maxRow = total - 1;

      if (e.key === "Tab") {
        e.preventDefault();
        const next = e.shiftKey
          ? colIndex > 0 ? { r: rowIndex, c: colIndex - 1 } : rowIndex > 0 ? { r: rowIndex - 1, c: maxCol } : null
          : colIndex < maxCol ? { r: rowIndex, c: colIndex + 1 } : rowIndex < maxRow ? { r: rowIndex + 1, c: 0 } : null;
        if (next) {
          const record = allRows[next.r];
          const field  = fields[next.c];
          if (record && field) setActiveCell({ recordId: record.id, fieldId: field.id, rowIndex: next.r, colIndex: next.c });
        }
        return;
      }

      const moves: Record<string, [number, number]> = {
        ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0],
      };
      const move = moves[e.key];
      if (move) {
        const [dr, dc] = move;
        const nr = rowIndex + dr;
        const nc = colIndex + dc;
        if (nr >= 0 && nr <= maxRow && nc >= 0 && nc <= maxCol) {
          const record = allRows[nr];
          const field  = fields[nc];
          if (record && field) setActiveCell({ recordId: record.id, fieldId: field.id, rowIndex: nr, colIndex: nc });
        }
        return;
      }

      if (e.key === "Escape") setActiveCell(null);
    },
    [fields, allRows, total],
  );

  const toggleRow = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else              next.add(id);
      return next;
    });
  }, []);

  if (!countData || status === "pending") {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <Loader2 className="h-5 w-5 animate-spin text-[#1170cb]" />
      </div>
    );
  }

  const totalWidth = INDEX_WIDTH + fields.length * COL_WIDTH + 52;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">

      {/* ── Column headers ── */}
      <div
        className="flex shrink-0 border-b border-[#e0e0e0] bg-[#f8f8f8]"
        style={{ width: totalWidth, minWidth: "100%" }}
      >
        {/* Checkbox + expand column header */}
        <div
          className="flex shrink-0 items-center justify-end gap-1.5 border-r border-[#e0e0e0] pr-2"
          style={{ width: INDEX_WIDTH, height: ROW_HEIGHT }}
        >
          <Checkbox checked={selectedRows.size === allRows.length && allRows.length > 0} />
        </div>

        {/* Field headers */}
        {fields.map((field) => (
          <div
            key={field.id}
            className="flex shrink-0 cursor-pointer items-center gap-[6px] border-r border-[#e0e0e0] px-3 hover:bg-[#f0f0f0]"
            style={{ width: COL_WIDTH, height: ROW_HEIGHT }}
          >
            <FieldTypeIcon type={field.type} />
            <span className="truncate text-[13px] font-medium text-[#1f1f1f]">{field.name}</span>
          </div>
        ))}

        {/* Add column button */}
        <div className="relative shrink-0">
          <AddColumnButton tableId={tableId} />
        </div>
      </div>

      {/* ── Virtualised rows ── */}
      <div
        ref={parentRef}
        className="flex-1 overflow-auto"
        onClick={() => setActiveCell(null)}
        onKeyDown={(e) => {
          if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
        }}
      >
        <div
          style={{
            height:   rowVirtualizer.getTotalSize(),
            width:    totalWidth,
            minWidth: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualRow) => {
            const record    = allRows[virtualRow.index];
            const isSelected = record ? selectedRows.has(record.id) : false;

            // Unloaded row — blank placeholder, structure preserved
            if (!record) {
              return (
                <div
                  key={virtualRow.key}
                  style={{ position: "absolute", top: virtualRow.start, width: "100%", height: ROW_HEIGHT, display: "flex" }}
                  className="border-b border-[#e8e8e8]"
                >
                  <div className="flex shrink-0 items-center justify-end gap-1.5 border-r border-[#e0e0e0] pr-2"
                    style={{ width: INDEX_WIDTH }}>
                    <span className="text-[12px] text-[#999]">{virtualRow.index + 1}</span>
                  </div>
                  {fields.map((f) => (
                    <div key={f.id} className="shrink-0 border-r border-[#e0e0e0]"
                      style={{ width: COL_WIDTH }} />
                  ))}
                </div>
              );
            }

            return (
              <div
                key={virtualRow.key}
                style={{ position: "absolute", top: virtualRow.start, width: "100%", height: ROW_HEIGHT, display: "flex" }}
                className={`group border-b border-[#e8e8e8] ${isSelected ? "bg-[#edf4ff]" : "hover:bg-[#f9f9f9]"}`}
              >
                {/* Row index + checkbox */}
                <div
                  className="flex shrink-0 items-center justify-end gap-[6px] border-r border-[#e0e0e0] pr-2"
                  style={{ width: INDEX_WIDTH, height: ROW_HEIGHT }}
                >
                  {/* Row number — hidden on hover/select, replaced by checkbox */}
                  <span className={`text-[12px] text-[#999] transition-opacity ${isSelected ? "opacity-0 group-hover:opacity-0" : "opacity-100 group-hover:opacity-0"}`}
                    style={{ position: "absolute", right: 36 }}>
                    {virtualRow.index + 1}
                  </span>
                  {/* Expand icon — only on hover */}
                  <div className={`absolute right-[18px] transition-opacity ${isSelected || true ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`}>
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="text-[#aaa]">
                      <path d="M2 2h4M2 2v4M12 2h-4M12 2v4M2 12h4M2 12v-4M12 12h-4M12 12v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleRow(record.id)}
                  />
                </div>

                {/* Cells */}
                {fields.map((field, colIndex) => {
                  const isActive = activeCell?.recordId === record.id && activeCell?.fieldId === field.id;
                  const value    = record.data[field.id] ?? null;

                  return (
                    <div
                      key={field.id}
                      ref={(el) => setCellRef(record.id, field.id, el)}
                      className={`relative shrink-0 border-r border-[#e0e0e0] ${
                        isActive
                          ? "z-10 shadow-[inset_0_0_0_2px_#1170cb]"
                          : ""
                      }`}
                      style={{ width: COL_WIDTH, height: ROW_HEIGHT }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCell({ recordId: record.id, fieldId: field.id, rowIndex: virtualRow.index, colIndex });
                      }}
                    >
                      <CellEditor
                        value={value}
                        fieldType={field.type}
                        isActive={isActive}
                        onCommit={(newValue) =>
                          updateCell.mutate({ recordId: record.id, fieldId: field.id, value: newValue })
                        }
                        onKeyDown={(e) => handleKeyDown(e, virtualRow.index, colIndex)}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex shrink-0 items-center justify-between border-t border-[#e0e0e0] bg-[#f8f8f8] px-3 py-0" style={{ height: 36 }}>
        <div className="flex items-center gap-2">
          {/* Add row */}
          <button
            onClick={() => createRecord.mutate({ tableId })}
            disabled={createRecord.isPending}
            className="flex items-center gap-[5px] rounded px-2 py-1 text-[13px] text-[#555] transition-colors hover:bg-[#ebebeb]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add row</span>
          </button>

          <div className="h-4 w-px bg-[#e0e0e0]" />

          {/* 100k rows button */}
          <button
            onClick={() => bulkCreate.mutate({ tableId, count: 100000 })}
            disabled={bulkCreate.isPending}
            className="flex items-center gap-[5px] rounded px-2 py-1 text-[13px] text-[#555] transition-colors hover:bg-[#ebebeb]"
          >
            {bulkCreate.isPending
              ? <><Loader2 className="h-3 w-3 animate-spin" /><span>Adding 100k rows…</span></>
              : <><Plus className="h-3.5 w-3.5" /><span>100k rows</span></>
            }
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isFetchingNextPage && (
            <span className="flex items-center gap-1 text-[12px] text-[#999]">
              <Loader2 className="h-3 w-3 animate-spin" /> Loading…
            </span>
          )}
          <span className="text-[12px] text-[#777]">
            {total.toLocaleString()} {total === 1 ? "record" : "records"}
          </span>
        </div>
      </div>
    </div>
  );
}