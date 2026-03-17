// src/features/base/components/TableGrid.tsx
"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { api } from "~/trpc/react";
import { Plus, Loader2 } from "lucide-react";
import type { FieldSummary, Filter, Sort, Row } from "~/types";
import { CellEditor } from "./CellEditor";
import { AddColumnButton } from "./AddColumnButton";
import { ColumnHeaderMenu } from "./ColumnHeaderMenu";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const ROW_HEIGHT      = 32;
const COL_WIDTH       = 180;
const INDEX_WIDTH     = 44; // checkbox + row number

interface ActiveCell {
  recordId: string;
  fieldId:  string;
  rowIndex: number;
  colIndex: number;
}

interface Props {
  tableId:      string;
  fields:       FieldSummary[];
  allFields?:   FieldSummary[];
  search:       string;
  filters:      Filter[];
  sorts:        Sort[];
  searchIndex?: number;
  onHideField?:      (fieldId: string) => void;
  onFilterByField?:  (fieldId: string) => void;
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

export function TableGrid({ tableId, fields, allFields: _allFields, search, filters, sorts, searchIndex = 1, onHideField, onFilterByField }: Props) {
  const parentRef             = useRef<HTMLDivElement>(null);
  const [activeCell, setActiveCell]       = useState<ActiveCell | null>(null);
  const [entryMode, setEntryMode]         = useState<"replace" | "append">("replace");
  const [selectedRows, setSelectedRows]   = useState<Set<string>>(new Set());
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const tempToRealId = useRef<Map<string, string>>(new Map());
  const pendingCellUpdates = useRef<{ tempId: string; fieldId: string; value: string | number | null }[]>([]);

  const setCellRef = useCallback((recordId: string, fieldId: string, el: HTMLDivElement | null) => {
    const key = `${recordId}:${fieldId}`;
    if (el) cellRefs.current.set(key, el);
    else    cellRefs.current.delete(key);
  }, []);

  const utils = api.useUtils();

  // ── listAll: single tRPC call, server-side parallel fetch ─────────────────
  // Replaces sequential useInfiniteQuery (20 round-trips) with one call
  // that fetches all pages in parallel on the server via Promise.all.
  const { data: listAllData } = api.record.listAll.useQuery(
    { tableId, filters, sorts, search },
    { staleTime: 60_000 },
  );
  const total = listAllData?.total ?? 0;
  const allRows: Row[] = useMemo(
    () => (listAllData?.records as Row[] | undefined) ?? [],
    [listAllData],
  );

  // ── Search match map: cell key → 1-based match index ──────────────────────
  const searchMatchMap = useMemo(() => {
    const map = new Map<string, number>();
    const term = search.trim().toLowerCase();
    if (!term) return map;
    let idx = 0;
    for (const row of allRows) {
      for (const field of fields) {
        const val = row.data[field.id];
        if (val != null && String(val).toLowerCase().startsWith(term)) {
          idx++;
          map.set(`${row.id}:${field.id}`, idx);
        }
      }
    }
    return map;
  }, [allRows, fields, search]);

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

  // No progressive fetching needed — listAll returns all rows in one call.

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

  const queryKey = { tableId, filters, sorts, search };

  // ── Optimistic cell update ────────────────────────────────────────────────
  const updateCell = api.record.updateCell.useMutation({
    onMutate: async ({ recordId, fieldId, value }) => {
      await utils.record.listAll.cancel(queryKey);
      const previousData = utils.record.listAll.getData(queryKey);

      utils.record.listAll.setData(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          records: old.records.map((r: Row) =>
            r.id === recordId
              ? { ...r, data: { ...r.data, [fieldId]: value } }
              : r,
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        utils.record.listAll.setData(queryKey, context.previousData);
      }
    },
  });

  const createRecord = api.record.create.useMutation({
    onMutate: async () => {
      await utils.record.listAll.cancel(queryKey);
      const previousData = utils.record.listAll.getData(queryKey);

      const tempId = `temp-${Date.now()}`;
      const lastRow = allRows[allRows.length - 1];
      const newOrder = (lastRow?.order ?? -1) + 1;
      const now = new Date();
      const tempRow: Row = { id: tempId, tableId, order: newOrder, data: {}, createdAt: now, updatedAt: now };

      utils.record.listAll.setData(queryKey, (old) => {
        if (!old) return old;
        return { ...old, records: [...old.records as Row[], tempRow], total: old.total + 1 };
      });

      const firstField = fields[0];
      if (firstField) {
        const newRowIndex = total;
        setActiveCell({ recordId: tempId, fieldId: firstField.id, rowIndex: newRowIndex, colIndex: 0 });
        requestAnimationFrame(() => {
          rowVirtualizer.scrollToIndex(newRowIndex, { align: "end" });
        });
      }

      return { previousData, tempId };
    },
    onSuccess: (newRow, _vars, context) => {
      if (!context?.tempId) return;
      tempToRealId.current.set(context.tempId, newRow.id);

      utils.record.listAll.setData(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          records: old.records.map((r: Row) =>
            r.id === context.tempId
              ? { ...newRow, data: { ...newRow.data, ...r.data } }
              : r,
          ),
        };
      });

      setActiveCell((prev) =>
        prev?.recordId === context.tempId ? { ...prev, recordId: newRow.id } : prev,
      );

      const queued = pendingCellUpdates.current.filter((u) => u.tempId === context.tempId);
      pendingCellUpdates.current = pendingCellUpdates.current.filter((u) => u.tempId !== context.tempId);
      for (const u of queued) {
        updateCell.mutate({ recordId: newRow.id, fieldId: u.fieldId, value: u.value });
      }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        utils.record.listAll.setData(queryKey, context.previousData);
      }
      setActiveCell(null);
    },
  });

  const bulkCreate = api.record.bulkCreate.useMutation({
    onSuccess: async () => {
      await utils.record.listAll.invalidate();
    },
  });

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      const maxCol = fields.length - 1;
      const maxRow = total - 1;

      if (e.key === "Tab") {
        e.preventDefault();
        setEntryMode("append");
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

      if (e.key === "Escape") { setActiveCell(null); setSelectedColumn(null); }
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

  // ── Drag-to-reorder state ──────────────────────────────────────────────────
  const [dragRowIndex, setDragRowIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const reorderRecord = api.record.reorder.useMutation({
    onMutate: async ({ recordId, fromOrder, toOrder }) => {
      await utils.record.listAll.cancel(queryKey);
      const prev = utils.record.listAll.getData(queryKey);

      utils.record.listAll.setData(queryKey, (old) => {
        if (!old) return old;
        const rows = old.records.map((r: Row) => {
          if (r.id === recordId) return { ...r, order: toOrder };
          if (fromOrder < toOrder) {
            if (r.order > fromOrder && r.order <= toOrder)
              return { ...r, order: r.order - 1 };
          } else {
            if (r.order >= toOrder && r.order < fromOrder)
              return { ...r, order: r.order + 1 };
          }
          return r;
        });
        rows.sort((a: Row, b: Row) => a.order - b.order);
        return { ...old, records: rows };
      });

      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) utils.record.listAll.setData(queryKey, context.prev);
    },
    onSettled: () => {
      void utils.record.listAll.invalidate(queryKey);
    },
  });

  const handleDragStart = useCallback((e: React.DragEvent, rowIndex: number) => {
    setDragRowIndex(rowIndex);
    e.dataTransfer.effectAllowed = "move";
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, rowIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragRowIndex === null) return;
    // Use cursor position within the row to decide above/below
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    let target: number;
    if (e.clientY < midY) {
      // Top half → insert above this row
      target = rowIndex;
    } else {
      // Bottom half → insert below this row
      target = rowIndex + 1;
    }
    // Clamp and skip no-ops (dropping right above or below the dragged row)
    if (target === dragRowIndex || target === dragRowIndex + 1) {
      setDropTargetIndex(null);
    } else {
      setDropTargetIndex(target);
    }
  }, [dragRowIndex]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dragRowIndex === null || dropTargetIndex === null) {
      setDragRowIndex(null);
      setDropTargetIndex(null);
      return;
    }
    // dropTargetIndex is the insertion point (row index the dragged row will end up at)
    // If inserting below the drag origin, the effective target is one less
    // because removing the source shifts everything above the target up.
    const toIndex = dropTargetIndex > dragRowIndex
      ? dropTargetIndex - 1
      : dropTargetIndex;

    if (toIndex === dragRowIndex) {
      setDragRowIndex(null);
      setDropTargetIndex(null);
      return;
    }

    const fromRecord = allRows[dragRowIndex];
    const toRecord   = allRows[toIndex];
    if (fromRecord && toRecord && !reorderRecord.isPending) {
      reorderRecord.mutate({
        recordId:  fromRecord.id,
        tableId,
        fromOrder: fromRecord.order,
        toOrder:   toRecord.order,
      });
    }
    setDragRowIndex(null);
    setDropTargetIndex(null);
  }, [dragRowIndex, dropTargetIndex, allRows, tableId, reorderRecord]);

  const handleDragEnd = useCallback(() => {
    setDragRowIndex(null);
    setDropTargetIndex(null);
  }, []);

  const handleAddRecord = useCallback(() => {
    if (!createRecord.isPending) {
      createRecord.mutate({ tableId });
    }
  }, [createRecord, tableId]);

  const handleBulkAdd = useCallback(() => {
    if (!bulkCreate.isPending) {
      bulkCreate.mutate({ tableId, count: 100000 });
    }
  }, [bulkCreate, tableId]);

  if (!listAllData) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <Loader2 className="h-5 w-5 animate-spin text-[#1170cb]" />
      </div>
    );
  }

  const dataWidth  = INDEX_WIDTH + fields.length * COL_WIDTH;
  const addColWidth = 92;
  const totalWidth = dataWidth + addColWidth;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">

      {/* ── Column headers ── */}
      <div
        className="flex shrink-0"
        style={{ minWidth: "100%" }}
      >
        {/* Checkbox + expand column header */}
        <div
          className="flex shrink-0 items-center justify-center border-b border-[#d1d1d1] bg-white"
          style={{ width: INDEX_WIDTH, height: ROW_HEIGHT }}
        >
          <Checkbox
            checked={selectedRows.size === allRows.length && allRows.length > 0}
            onChange={() => {
              if (selectedRows.size === allRows.length) {
                setSelectedRows(new Set());
              } else {
                setSelectedRows(new Set(allRows.map((r) => r.id)));
              }
            }}
          />
        </div>

        {/* Field headers */}
        {fields.map((field, colIndex) => (
          <div
            key={field.id}
            className={`group/header relative flex shrink-0 cursor-pointer items-center gap-1.5 border-b border-r border-[#d1d1d1] px-3 hover:bg-[#e8e8e8] ${
              selectedColumn === field.id ? "bg-[#f1f6ff]" : "bg-white"
            }`}
            style={{ width: COL_WIDTH, height: ROW_HEIGHT }}
            onClick={() => {
              setSelectedColumn(field.id);
              setSelectedRows(new Set());
              const firstRecord = allRows[0];
              if (firstRecord) {
                setEntryMode("replace");
                setActiveCell({ recordId: firstRecord.id, fieldId: field.id, rowIndex: 0, colIndex });
              }
            }}
          >
            <FieldTypeIcon type={field.type} />
            <span className="flex-1 truncate text-[13px] font-medium text-[#1d1f25]">{field.name}</span>
            <ColumnHeaderMenu
              field={field}
              tableId={tableId}
              onHideField={(id) => onHideField?.(id)}
              onFilterByField={(id) => onFilterByField?.(id)}
              onDuplicated={noop}
              onDeleted={noop}
            />
          </div>
        ))}

        {/* Add column button */}
        <div className="relative shrink-0 border-b border-[#d1d1d1]">
          <AddColumnButton tableId={tableId} />
        </div>

        {/* Fill remaining header space — matches empty grid bg */}
        <div className="flex-1 bg-[#f5f5f5]" style={{ height: ROW_HEIGHT }} />
      </div>

      {/* ── Virtualised rows ── */}
      <div
        ref={parentRef}
        className="grid-scroll flex-1 overflow-auto bg-[#f5f5f5]"
        onClick={() => { setActiveCell(null); setSelectedColumn(null); }}
        onKeyDown={(e) => {
          if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
        }}
      >
        <div
          style={{
            height:   rowVirtualizer.getTotalSize() + ROW_HEIGHT,
            width:    totalWidth,
            minWidth: "100%",
            position: "relative",
          }}
        >
          {/* Drop indicator line */}
          {dropTargetIndex !== null && dragRowIndex !== null && (
            <div
              style={{
                position: "absolute",
                top: dropTargetIndex * ROW_HEIGHT - 1,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: "#2d7ff9",
                zIndex: 20,
                pointerEvents: "none",
              }}
            />
          )}

          {virtualItems.map((virtualRow) => {
            const record    = allRows[virtualRow.index];
            const isSelected = record ? selectedRows.has(record.id) : false;

            // Unloaded row — blank placeholder, structure preserved
            if (!record) {
              return (
                <div
                  key={virtualRow.key}
                  style={{ position: "absolute", top: virtualRow.start, width: dataWidth, height: ROW_HEIGHT, display: "flex" }}
                  className="border-b border-[#dde1e3] bg-white"
                >
                  <div className="flex shrink-0 items-center justify-end gap-1.5 pr-2"
                    style={{ width: INDEX_WIDTH }}>
                    <span className="text-[12px] text-[#616670]">{virtualRow.index + 1}</span>
                  </div>
                  {fields.map((f) => (
                    <div key={f.id} className="shrink-0 border-r border-[#dde1e3]"
                      style={{ width: COL_WIDTH }} />
                  ))}
                </div>
              );
            }

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: virtualRow.start,
                  width: dataWidth,
                  height: ROW_HEIGHT,
                  display: "flex",
                  opacity: dragRowIndex === virtualRow.index ? 0.4 : 1,
                }}
                className={`group border-b border-[#dde1e3] ${isSelected ? "bg-[#edf4ff]" : "bg-white hover:bg-[#f9f9f9]"}`}
                onDragOver={(e) => handleDragOver(e, virtualRow.index)}
                onDrop={handleDrop}
              >
                {/* Row index area: drag handle | expand | checkbox */}
                <div
                  className="relative flex shrink-0 items-center"
                  style={{ width: INDEX_WIDTH, height: ROW_HEIGHT }}
                >
                  {/* Row number — visible by default, hidden on hover */}
                  <span className={`absolute inset-0 flex items-center justify-center text-[12px] text-[#616670] transition-opacity ${isSelected ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}>
                    {virtualRow.index + 1}
                  </span>

                  {/* Hover controls — shown on hover or when selected */}
                  <div className={`absolute inset-0 flex items-center justify-center gap-0.5 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    {/* Drag handle (6-dot grip) */}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, virtualRow.index)}
                      onDragEnd={handleDragEnd}
                      className="flex cursor-grab items-center rounded p-0.5 text-[#bbb] hover:bg-[#eee] hover:text-[#888] active:cursor-grabbing"
                    >
                      <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
                        <circle cx="3" cy="3" r="1.2" />
                        <circle cx="7" cy="3" r="1.2" />
                        <circle cx="3" cy="8" r="1.2" />
                        <circle cx="7" cy="8" r="1.2" />
                        <circle cx="3" cy="13" r="1.2" />
                        <circle cx="7" cy="13" r="1.2" />
                      </svg>
                    </div>

                    {/* Checkbox */}
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleRow(record.id)}
                    />

                    {/* Expand icon */}
                    <button className="flex items-center rounded border border-[#ddd] bg-white p-0.5 text-[#aaa] hover:bg-[#f5f5f5] hover:text-[#666]">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M4 12l8-8M12 4v5M12 4H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Cells */}
                {fields.map((field, colIndex) => {
                  const isActive = activeCell?.recordId === record.id && activeCell?.fieldId === field.id;
                  const value    = record.data[field.id] ?? null;
                  const matchIdx = searchMatchMap.get(`${record.id}:${field.id}`);
                  const isMatch       = matchIdx !== undefined;
                  const isActiveMatch = matchIdx === searchIndex;
                  const isColSelected = selectedColumn === field.id;

                  return (
                    <div
                      key={field.id}
                      ref={(el) => setCellRef(record.id, field.id, el)}
                      className={`relative shrink-0 border-r border-[#dde1e3] ${
                        isActive
                          ? "z-10 shadow-[inset_0_0_0_2px_#1170cb]"
                          : ""
                      }`}
                      style={{
                        width: COL_WIDTH,
                        height: ROW_HEIGHT,
                        backgroundColor: isActiveMatch ? "#fdd66a" : isMatch ? "#fff3d4" : isColSelected ? "#f1f6ff" : undefined,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColumn(null);
                        setEntryMode("replace");
                        setActiveCell({ recordId: record.id, fieldId: field.id, rowIndex: virtualRow.index, colIndex });
                      }}
                    >
                      <CellEditor
                        value={value}
                        fieldType={field.type}
                        isActive={isActive}
                        entryMode={entryMode}
                        onCommit={(newValue) => {
                          if (record.id.startsWith("temp-")) {
                            const realId = tempToRealId.current.get(record.id);
                            if (realId) {
                              updateCell.mutate({ recordId: realId, fieldId: field.id, value: newValue });
                            } else {
                              // Real ID not yet available — queue for flush in onSuccess
                              pendingCellUpdates.current.push({ tempId: record.id, fieldId: field.id, value: newValue });
                              utils.record.listAll.setData(queryKey, (old) => {
                                if (!old) return old;
                                return {
                                  ...old,
                                  records: old.records.map((r: Row) =>
                                    r.id === record.id
                                      ? { ...r, data: { ...r.data, [field.id]: newValue } }
                                      : r,
                                  ),
                                };
                              });
                            }
                          } else {
                            updateCell.mutate({ recordId: record.id, fieldId: field.id, value: newValue });
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, virtualRow.index, colIndex)}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* ── Add row — empty row after last data row ── */}
          <div
            style={{
              position: "absolute",
              top: total * ROW_HEIGHT,
              width: dataWidth,
              height: ROW_HEIGHT,
              display: "flex",
            }}
            className="border-b border-[#dde1e3] bg-white"
          >
            <div
              className="flex shrink-0 items-center pl-2"
              style={{ width: INDEX_WIDTH, height: ROW_HEIGHT }}
            >
              <button
                onClick={handleAddRecord}
                disabled={createRecord.isPending}
                className="flex items-center rounded p-1 text-[#888] transition-colors hover:bg-[#f0f0f0] hover:text-[#555]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            {fields.map((f) => (
              <div
                key={f.id}
                className="shrink-0 border-r border-[#dde1e3]"
                style={{ width: COL_WIDTH, height: ROW_HEIGHT }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating add overlay (bottom-left, above footer) ── */}
      <div className="pointer-events-none absolute bottom-8 left-0 z-20 px-3 py-2">
        <div className="pointer-events-auto flex items-center gap-0 rounded-full border border-black/10 bg-white shadow-sm">
          <button
            onClick={handleAddRecord}
            disabled={createRecord.isPending}
            className="flex items-center justify-center rounded-l-full border-r border-black/10 px-2.5 py-1 text-[#1d1f25]/60 transition-colors hover:bg-black/5"
            title="Add record"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleBulkAdd}
            disabled={bulkCreate.isPending}
            className="flex items-center gap-1.5 rounded-r-full px-2.5 py-1 text-[#555] transition-colors hover:bg-[#f5f5f5]"
            title="Add 100k records"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#555]">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[12px] font-medium">Add...</span>
          </button>
        </div>
      </div>

      {/* ── Bottom footer: record count ── */}
      <div className="flex h-[32px] shrink-0 items-center border-t border-black/10 bg-[#f2f4f8] px-4">
        <span className="text-[13px] text-[#1d1f25]">
          {total.toLocaleString()} record{total !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}