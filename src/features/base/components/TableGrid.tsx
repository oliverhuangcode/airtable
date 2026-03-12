// src/features/base/components/TableGrid.tsx
"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { api } from "~/trpc/react";
import { Plus, Loader2 } from "lucide-react";
import type { FieldSummary, Filter, Sort, Row } from "~/types";
import { CellEditor } from "./CellEditor";
import { AddColumnButton } from "./AddColumnButton";

const ROW_HEIGHT  = 32;
const COL_WIDTH   = 180;
const INDEX_WIDTH = 52;
const FETCH_LIMIT = 200;

interface ActiveCell {
  recordId: string;
  fieldId:  string;
  rowIndex: number;
  colIndex: number;
}

interface Props {
  tableId:   string;
  fields:    FieldSummary[];
  allFields: FieldSummary[];
  search:    string;
  filters:   Filter[];
  sorts:     Sort[];
}

export function TableGrid({ tableId, fields, allFields, search, filters, sorts }: Props) {
  const parentRef  = useRef<HTMLDivElement>(null);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);

  // Map of "recordId:fieldId" → div element so we can imperatively focus after navigation
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const setCellRef = useCallback((recordId: string, fieldId: string, el: HTMLDivElement | null) => {
    const key = `${recordId}:${fieldId}`;
    if (el) cellRefs.current.set(key, el);
    else    cellRefs.current.delete(key);
  }, []);

  const utils = api.useUtils();

  // ── READ ──────────────────────────────────────────────────────────────────
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    api.record.list.useInfiniteQuery(
      { tableId, limit: FETCH_LIMIT, filters, sorts, search },
      { getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined },
    );

  const records: Row[] = useMemo(() => data?.pages.flatMap((p) => p.records) ?? [], [data]);
  const total          = useMemo(() => data?.pages[0]?.total ?? 0, [data]);

  // ── VIRTUALIZER ───────────────────────────────────────────────────────────
  const rowVirtualizer = useVirtualizer({
    count:            hasNextPage ? records.length + 1 : records.length,
    getScrollElement: () => parentRef.current,
    estimateSize:     () => ROW_HEIGHT,
    overscan:         50,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems.at(-1);
    if (!lastItem) return;
    const fetchThreshold = Math.floor(records.length * 0.8);
    if (lastItem.index >= fetchThreshold && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [virtualItems, hasNextPage, isFetchingNextPage, records.length, fetchNextPage]);

  // ── Focus the active cell's div after navigation ──────────────────────────
  // This is what was missing — after setActiveCell, we imperatively focus the
  // new cell so keyboard events land on it immediately without needing a click
useEffect(() => {
  if (!activeCell) return;
  const { recordId, fieldId } = activeCell;
  const key = `${recordId}:${fieldId}`;
  requestAnimationFrame(() => {
    const el = cellRefs.current.get(key);
    if (!el) return;
    const inner = el.querySelector<HTMLElement>("[tabindex]");
    inner?.focus({ preventScroll: true });

    const parent = parentRef.current;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const elRect     = el.getBoundingClientRect();
    if (elRect.bottom > parentRect.bottom) {
      parent.scrollTop += elRect.bottom - parentRect.bottom + 4;
    } else if (elRect.top < parentRect.top) {
      parent.scrollTop -= parentRect.top - elRect.top + 4;
    }
  });
}, [activeCell]); // ← single object dep, never changes size

  // ── WRITE: update cell ────────────────────────────────────────────────────
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
                r.id === recordId ? { ...r, data: { ...r.data, [fieldId]: value } } : r,
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

  // ── WRITE: create / bulk create ───────────────────────────────────────────
  const createRecord = api.record.create.useMutation({
    onSuccess: () => void utils.record.list.invalidate({ tableId }),
  });
  const bulkCreate = api.record.bulkCreate.useMutation({
    onSuccess: () => void utils.record.list.invalidate({ tableId }),
  });

  // ── KEYBOARD NAVIGATION ───────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      const maxCol = fields.length - 1;
      const maxRow = records.length - 1;

      if (e.key === "Tab") {
        e.preventDefault();
        const next = e.shiftKey
          ? colIndex > 0
            ? { r: rowIndex,     c: colIndex - 1 }
            : rowIndex > 0
              ? { r: rowIndex - 1, c: maxCol }
              : null
          : colIndex < maxCol
            ? { r: rowIndex,     c: colIndex + 1 }
            : rowIndex < maxRow
              ? { r: rowIndex + 1, c: 0 }
              : null;

        if (next) {
          const record = records[next.r];
          const field  = fields[next.c];
          if (record && field) {
            setActiveCell({ recordId: record.id, fieldId: field.id, rowIndex: next.r, colIndex: next.c });
          }
        }
        return;
      }

      const moves: Record<string, [number, number]> = {
        ArrowRight: [0,  1],
        ArrowLeft:  [0, -1],
        ArrowDown:  [1,  0],
        ArrowUp:    [-1, 0],
      };
      const move = moves[e.key];
      if (move) {
        const [dr, dc] = move;
        const nr = rowIndex + dr;
        const nc = colIndex + dc;
        if (nr >= 0 && nr <= maxRow && nc >= 0 && nc <= maxCol) {
          const record = records[nr];
          const field  = fields[nc];
          if (record && field) {
            setActiveCell({ recordId: record.id, fieldId: field.id, rowIndex: nr, colIndex: nc });
          }
        }
        return;
      }

      if (e.key === "Escape") setActiveCell(null);
    },
    [fields, records],
  );

  // ── LOADING / ERROR ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[#1170cb]" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-red-500">
        Failed to load records
      </div>
    );
  }

  const totalWidth = INDEX_WIDTH + fields.length * COL_WIDTH + 52;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Sticky column headers */}
      <div
        className="flex flex-shrink-0 border-b border-[#e0e0e0] bg-[#f8f8f8]"
        style={{ width: totalWidth, minWidth: "100%" }}
      >
        <div
          className="flex flex-shrink-0 items-center justify-center border-r border-[#e0e0e0]"
          style={{ width: INDEX_WIDTH, height: ROW_HEIGHT }}
        />
        {fields.map((field) => (
          <div
            key={field.id}
            className="flex flex-shrink-0 items-center gap-1.5 border-r border-[#e0e0e0] px-3"
            style={{ width: COL_WIDTH, height: ROW_HEIGHT }}
          >
            <span className="text-[10px] text-[#999]">{field.type === "NUMBER" ? "#" : "T"}</span>
            <span className="truncate text-xs font-medium text-[#1f1f1f]">{field.name}</span>
          </div>
        ))}
        <div className="relative">
          <AddColumnButton tableId={tableId} />
        </div>
      </div>

      {/* Virtualised rows */}
      <div
        ref={parentRef}
        className="flex-1 overflow-auto"
        onClick={() => setActiveCell(null)}
        onKeyDown={(e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault(); // stop browser from scrolling the container
    }
  }}
      >
        <div
          style={{
            height:    rowVirtualizer.getTotalSize(),
            width:     totalWidth,
            minWidth:  "100%",
            position:  "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index >= records.length;
            const record      = records[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top:      virtualRow.start,
                  width:    "100%",
                  height:   ROW_HEIGHT,
                  display:  "flex",
                }}
                className="border-b border-[#e8e8e8] hover:bg-[#f9f9f9]"
              >
                {isLoaderRow ? (
                  <div className="flex w-full items-center justify-center">
                    {isFetchingNextPage && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#999]" />}
                  </div>
                ) : record ? (
                  <>
                    <div
                      className="flex flex-shrink-0 items-center justify-center border-r border-[#e0e0e0] text-[11px] text-[#bbb]"
                      style={{ width: INDEX_WIDTH }}
                    >
                      {virtualRow.index + 1}
                    </div>

                    {fields.map((field, colIndex) => {
                      const isActive =
                        activeCell?.recordId === record.id &&
                        activeCell?.fieldId   === field.id;
                      const value = record.data[field.id] ?? null;

                      return (
                        <div
                          key={field.id}
                          ref={(el) => setCellRef(record.id, field.id, el)}
                          className={`relative flex-shrink-0 border-r border-[#e0e0e0] ${
                            isActive ? "z-10 outline outline-2 outline-[#1170cb]" : ""
                          }`}
                          style={{ width: COL_WIDTH, height: ROW_HEIGHT }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCell({
                              recordId: record.id,
                              fieldId:  field.id,
                              rowIndex: virtualRow.index,
                              colIndex,
                            });
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
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-shrink-0 items-center justify-between border-t border-[#e0e0e0] bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => createRecord.mutate({ tableId })}
            disabled={createRecord.isPending}
            className="flex items-center gap-1.5 text-xs text-[#666] transition-colors hover:text-[#1170cb]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add row
          </button>
          <button
            onClick={() => bulkCreate.mutate({ tableId, count: 100000 })}
            disabled={bulkCreate.isPending}
            className="flex items-center gap-1.5 rounded border border-[#e0e0e0] px-2.5 py-1 text-xs text-[#666] transition-colors hover:border-[#1170cb] hover:text-[#1170cb]"
          >
            {bulkCreate.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "+ 100k rows"}
          </button>
        </div>
        <span className="text-xs text-[#999]">{total.toLocaleString()} rows</span>
      </div>
    </div>
  );
}