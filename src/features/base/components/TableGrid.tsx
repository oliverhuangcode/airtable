"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type ColumnSizingState,
} from "@tanstack/react-table";
import { api } from "~/trpc/react";
import { Plus, Loader2 } from "lucide-react";
import type { FieldSummary, Filter, Sort, Row as DataRow } from "~/types";
import { ROW_HEIGHT, COL_WIDTH, PAGE_SIZE } from "~/lib/constants";
import { CellEditor } from "./CellEditor";
import { AddColumnButton } from "./AddColumnButton";
import { ColumnHeaderMenu } from "./ColumnHeaderMenu";

// Extend TanStack Table's ColumnMeta to carry the field type on each column.
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    fieldType: string;
  }
}

// Intentional no-op for unimplemented column actions (duplicate field, delete field).
const noop = () => undefined;

interface ActiveCell {
  recordId: string;
  fieldId: string;
  rowIndex: number;
  colIndex: number;
}

interface Props {
  tableId: string;
  fields: FieldSummary[];
  allFields?: FieldSummary[];
  search: string;
  filters: Filter[];
  sorts: Sort[];
  searchIndex?: number;
  isClearing?: boolean;
  onHideField?: (fieldId: string) => void;
  onFilterByField?: (fieldId: string) => void;
}

function FieldTypeIcon({ type }: { type: string }) {
  if (type === "NUMBER") {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        className="flex-shrink-0 text-[#666]"
      >
        <text
          x="1"
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
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0 text-[#666]"
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

function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange?: () => void;
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onChange?.();
      }}
      className={`h-[15px] w-[15px] flex-shrink-0 cursor-pointer rounded-[3px] border transition-colors ${
        checked
          ? "border-[#1170cb] bg-[#1170cb]"
          : "border-[#c8c8c8] bg-white hover:border-[#a0a0a0]"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 10 8" fill="none" className="h-full w-full p-[2px]">
          <path
            d="M1 4l3 3 5-6"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

export function TableGrid({
  tableId,
  fields,
  allFields: _allFields,
  search,
  filters,
  sorts,
  searchIndex = 1,
  isClearing = false,
  onHideField,
  onFilterByField,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const [entryMode, setEntryMode] = useState<"replace" | "append">("replace");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const tempToRealId = useRef<Map<string, string>>(new Map());
  const scrollToTopAfterLoad = useRef(false);
  const pendingCellUpdates = useRef<
    { tempId: string; fieldId: string; value: string | number | null }[]
  >([]);

  const setCellRef = useCallback(
    (recordId: string, fieldId: string, el: HTMLDivElement | null) => {
      const key = `${recordId}:${fieldId}`;
      if (el) cellRefs.current.set(key, el);
      else cellRefs.current.delete(key);
    },
    [],
  );

  const utils = api.useUtils();

  const listQueryInput = useMemo(
    () => ({ tableId, filters, sorts, search, limit: PAGE_SIZE }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableId, JSON.stringify(filters), JSON.stringify(sorts), search],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.record.list.useInfiniteQuery(listQueryInput, {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      staleTime: 60_000,
    });

  const allRows: DataRow[] = useMemo(
    () => data?.pages.flatMap((p) => p.records) ?? [],
    [data],
  );
  const total = data?.pages[0]?.total ?? 0;

  // Widen the index column as row counts grow to avoid clipping the number.
  const indexWidth = useMemo(() => {
    const digits = String(Math.max(total, 1)).length;
    if (digits <= 3) return 52;
    if (digits <= 4) return 60;
    if (digits <= 5) return 68;
    return 76;
  }, [total]);

  const filteredFieldIds = useMemo(
    () => new Set(filters.map((f) => f.fieldId)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(filters)],
  );

  const sortedFieldIds = useMemo(
    () => new Set(sorts.map((s) => s.fieldId)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(sorts)],
  );

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  const columns = useMemo<ColumnDef<DataRow>[]>(
    () =>
      fields.map((field) => ({
        id: field.id,
        accessorFn: (row) => row.data[field.id] ?? null,
        header: field.name,
        size: COL_WIDTH,
        minSize: 72,
        enableResizing: true,
        meta: { fieldType: field.type },
      })),
    [fields],
  );

  const table = useReactTable<DataRow>({
    data: allRows,
    columns,
    state: { columnSizing },
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });

  // Restore body cursor/select styles if component unmounts during a column resize drag.
  useEffect(() => {
    return () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, []);

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

  const rowVirtualizer = useVirtualizer({
    count: total,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();

  // Eagerly fetch all pages in the background so scrolling never waits.
  useEffect(() => {
    if (data && hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [data, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // After bulk insert reloads data, scroll back to the top.
  useEffect(() => {
    if (data && scrollToTopAfterLoad.current) {
      scrollToTopAfterLoad.current = false;
      if (parentRef.current) parentRef.current.scrollTop = 0;
    }
  }, [data]);

  useEffect(() => {
    if (!activeCell) return;
    const key = `${activeCell.recordId}:${activeCell.fieldId}`;
    requestAnimationFrame(() => {
      const el = cellRefs.current.get(key);
      if (!el) return;
      el.querySelector<HTMLElement>("[tabindex]")?.focus({
        preventScroll: true,
      });
      const parent = parentRef.current;
      if (!parent) return;
      const pr = parent.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      if (er.bottom > pr.bottom) parent.scrollTop += er.bottom - pr.bottom + 4;
      else if (er.top < pr.top) parent.scrollTop -= pr.top - er.top + 4;
    });
  }, [activeCell]);

  const updateCell = api.record.updateCell.useMutation({
    onMutate: async ({ recordId, fieldId, value }) => {
      await utils.record.list.cancel(listQueryInput);
      const previousData = utils.record.list.getInfiniteData(listQueryInput);
      utils.record.list.setInfiniteData(listQueryInput, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            records: page.records.map((r) =>
              r.id === recordId
                ? { ...r, data: { ...r.data, [fieldId]: value } }
                : r,
            ),
          })),
        };
      });
      return { previousData };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previousData)
        utils.record.list.setInfiniteData(listQueryInput, ctx.previousData);
    },
  });

  const createRecord = api.record.create.useMutation({
    onMutate: async () => {
      await utils.record.list.cancel(listQueryInput);
      const previousData = utils.record.list.getInfiniteData(listQueryInput);
      const tempId = `temp-${Date.now()}`;
      const lastRow = allRows[allRows.length - 1];
      const newOrder = (lastRow?.order ?? -1) + 1;
      const now = new Date();
      const tempRow: DataRow = {
        id: tempId,
        tableId,
        order: newOrder,
        data: {},
        createdAt: now,
        updatedAt: now,
      };

      utils.record.list.setInfiniteData(listQueryInput, (old) => {
        if (!old) return old;
        const lastPageIdx = old.pages.length - 1;
        return {
          ...old,
          pages: old.pages.map((page, i) => ({
            ...page,
            total: i === 0 ? page.total + 1 : page.total,
            records:
              i === lastPageIdx ? [...page.records, tempRow] : page.records,
          })),
        };
      });

      const firstField = fields[0];
      if (firstField) {
        const newRowIndex = total;
        setActiveCell({
          recordId: tempId,
          fieldId: firstField.id,
          rowIndex: newRowIndex,
          colIndex: 0,
        });
        requestAnimationFrame(() =>
          rowVirtualizer.scrollToIndex(newRowIndex, { align: "end" }),
        );
      }
      return { previousData, tempId };
    },
    onSuccess: (newRow, _vars, ctx) => {
      if (!ctx?.tempId) return;
      tempToRealId.current.set(ctx.tempId, newRow.id);
      utils.record.list.setInfiniteData(listQueryInput, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            records: page.records.map((r) =>
              r.id === ctx.tempId
                ? { ...newRow, data: { ...newRow.data, ...r.data } }
                : r,
            ),
          })),
        };
      });
      setActiveCell((prev) =>
        prev?.recordId === ctx.tempId ? { ...prev, recordId: newRow.id } : prev,
      );
      const queued = pendingCellUpdates.current.filter(
        (u) => u.tempId === ctx.tempId,
      );
      pendingCellUpdates.current = pendingCellUpdates.current.filter(
        (u) => u.tempId !== ctx.tempId,
      );
      for (const u of queued)
        updateCell.mutate({
          recordId: newRow.id,
          fieldId: u.fieldId,
          value: u.value,
        });
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previousData)
        utils.record.list.setInfiniteData(listQueryInput, ctx.previousData);
      setActiveCell(null);
    },
  });

  const bulkCreate = api.record.bulkCreate.useMutation({
    onSuccess: () => {
      void utils.record.list.reset();
      void utils.record.count.invalidate();
      scrollToTopAfterLoad.current = true;
      setActiveCell(null);
    },
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      const maxCol = fields.length - 1;
      const maxRow = total - 1;

      if (e.key === "Tab") {
        e.preventDefault();
        setEntryMode("append");
        const next = e.shiftKey
          ? colIndex > 0
            ? { r: rowIndex, c: colIndex - 1 }
            : rowIndex > 0
              ? { r: rowIndex - 1, c: maxCol }
              : null
          : colIndex < maxCol
            ? { r: rowIndex, c: colIndex + 1 }
            : rowIndex < maxRow
              ? { r: rowIndex + 1, c: 0 }
              : null;
        if (next) {
          const record = allRows[next.r];
          const field = fields[next.c];
          if (record && field)
            setActiveCell({
              recordId: record.id,
              fieldId: field.id,
              rowIndex: next.r,
              colIndex: next.c,
            });
        }
        return;
      }

      const moves: Record<string, [number, number]> = {
        ArrowRight: [0, 1],
        ArrowLeft: [0, -1],
        ArrowDown: [1, 0],
        ArrowUp: [-1, 0],
      };
      const move = moves[e.key];
      if (move) {
        const [dr, dc] = move;
        const nr = rowIndex + dr;
        const nc = colIndex + dc;
        if (nr >= 0 && nr <= maxRow && nc >= 0 && nc <= maxCol) {
          const record = allRows[nr];
          const field = fields[nc];
          if (record && field)
            setActiveCell({
              recordId: record.id,
              fieldId: field.id,
              rowIndex: nr,
              colIndex: nc,
            });
        }
        return;
      }

      if (e.key === "Escape") {
        setActiveCell(null);
        setSelectedColumn(null);
      }
    },
    [fields, allRows, total],
  );

  const toggleRow = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const [dragRowIndex, setDragRowIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const reorderRecord = api.record.reorder.useMutation({
    onMutate: async ({ recordId, fromOrder, toOrder }) => {
      await utils.record.list.cancel(listQueryInput);
      const prev = utils.record.list.getInfiniteData(listQueryInput);
      utils.record.list.setInfiniteData(listQueryInput, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => {
            const rows = page.records.map((r) => {
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
            rows.sort((a, b) => a.order - b.order);
            return { ...page, records: rows };
          }),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        utils.record.list.setInfiniteData(listQueryInput, ctx.prev);
    },
    onSettled: () => {
      void utils.record.list.invalidate(listQueryInput);
    },
  });

  const handleDragStart = useCallback(
    (e: React.DragEvent, rowIndex: number) => {
      setDragRowIndex(rowIndex);
      e.dataTransfer.effectAllowed = "move";
      const img = new Image();
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      e.dataTransfer.setDragImage(img, 0, 0);
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, rowIndex: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragRowIndex === null) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const target =
        e.clientY < rect.top + rect.height / 2 ? rowIndex : rowIndex + 1;
      setDropTargetIndex(
        target === dragRowIndex || target === dragRowIndex + 1 ? null : target,
      );
    },
    [dragRowIndex],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (dragRowIndex === null || dropTargetIndex === null) {
        setDragRowIndex(null);
        setDropTargetIndex(null);
        return;
      }
      const toIndex =
        dropTargetIndex > dragRowIndex ? dropTargetIndex - 1 : dropTargetIndex;
      if (toIndex !== dragRowIndex) {
        const fromRecord = allRows[dragRowIndex];
        const toRecord = allRows[toIndex];
        if (fromRecord && toRecord && !reorderRecord.isPending) {
          reorderRecord.mutate({
            recordId: fromRecord.id,
            tableId,
            fromOrder: fromRecord.order,
            toOrder: toRecord.order,
          });
        }
      }
      setDragRowIndex(null);
      setDropTargetIndex(null);
    },
    [dragRowIndex, dropTargetIndex, allRows, tableId, reorderRecord],
  );

  const handleDragEnd = useCallback(() => {
    setDragRowIndex(null);
    setDropTargetIndex(null);
  }, []);
  const handleAddRecord = useCallback(() => {
    if (!createRecord.isPending) createRecord.mutate({ tableId });
  }, [createRecord, tableId]);
  const handleBulkAdd = useCallback(() => {
    if (!bulkCreate.isPending) bulkCreate.mutate({ tableId, count: 100000 });
  }, [bulkCreate, tableId]);

  if (!data) {
    const skeletonWidths = [65, 80, 45, 90, 55, 75, 40, 85, 60, 70, 50, 80, 65, 45, 90, 55, 75, 40, 85, 60];
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-white">
        {/* Skeleton column headers */}
        <div className="flex shrink-0" style={{ minWidth: "100%" }}>
          <div
            className="flex shrink-0 items-center justify-center border-b border-[#d1d1d1] bg-white"
            style={{ width: 52, height: ROW_HEIGHT }}
          />
          {fields.map((field) => (
            <div
              key={field.id}
              className="flex shrink-0 items-center gap-1.5 border-b border-r border-[#d1d1d1] bg-[#f2f4f8] px-2"
              style={{ width: COL_WIDTH, height: ROW_HEIGHT }}
            >
              <span className="truncate text-[13px] font-medium text-[#1d1f25]">
                {field.name}
              </span>
            </div>
          ))}
        </div>
        {/* Skeleton rows */}
        <div className="flex-1 overflow-hidden">
          {Array.from({ length: 20 }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex border-b border-[#e8eaed]"
              style={{ height: ROW_HEIGHT }}
            >
              <div
                className="flex shrink-0 items-center justify-center border-r border-[#e8eaed]"
                style={{ width: 52 }}
              >
                <div className="h-2.5 w-6 animate-pulse rounded bg-gray-200" />
              </div>
              {fields.map((field, colIdx) => (
                <div
                  key={field.id}
                  className="flex shrink-0 items-center border-r border-[#e8eaed] px-2"
                  style={{ width: COL_WIDTH }}
                >
                  <div
                    className="h-2.5 animate-pulse rounded bg-gray-100"
                    style={{
                      width: `${skeletonWidths[(rowIdx * fields.length + colIdx) % skeletonWidths.length]}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const visibleCols = table.getVisibleLeafColumns();
  const dataWidth =
    indexWidth + visibleCols.reduce((sum, col) => sum + col.getSize(), 0);
  const totalWidth = dataWidth + 92; // 92px for the add-column button

  const { rows: tanStackRows } = table.getRowModel();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">
      {/* Clearing progress bar */}
      {isClearing && (
        <div className="absolute inset-x-0 top-0 z-20 h-0.5 animate-pulse bg-[#1170cb]" />
      )}
      {/* Column headers */}
      <div className="flex shrink-0" style={{ minWidth: "100%" }}>
        <div
          className="flex shrink-0 items-center justify-center border-b border-[#d1d1d1] bg-white"
          style={{ width: indexWidth, height: ROW_HEIGHT }}
        >
          <Checkbox
            checked={selectedRows.size === allRows.length && allRows.length > 0}
            onChange={() =>
              setSelectedRows(
                selectedRows.size === allRows.length
                  ? new Set()
                  : new Set(allRows.map((r) => r.id)),
              )
            }
          />
        </div>

        {table.getHeaderGroups()[0]?.headers.map((header, colIndex) => {
          const field = fields[colIndex]!;
          return (
            <div
              key={header.id}
              className={`group/header relative flex shrink-0 cursor-pointer items-center gap-1.5 border-r border-b border-[#d1d1d1] px-3 hover:bg-[#e8e8e8] ${
                filteredFieldIds.has(field.id)
                  ? "bg-[#f8fefa]"
                  : sortedFieldIds.has(field.id)
                    ? "bg-[#fef9f8]"
                    : selectedColumn === field.id
                      ? "bg-[#f1f6ff]"
                      : "bg-white"
              }`}
              style={{ width: header.getSize(), height: ROW_HEIGHT }}
              onClick={() => {
                setSelectedColumn(field.id);
                setSelectedRows(new Set());
                const firstRecord = allRows[0];
                if (firstRecord) {
                  setEntryMode("replace");
                  setActiveCell({
                    recordId: firstRecord.id,
                    fieldId: field.id,
                    rowIndex: 0,
                    colIndex,
                  });
                }
              }}
            >
              <FieldTypeIcon type={field.type} />
              <span className="flex-1 truncate text-[13px] font-medium text-[#1d1f25]">
                {field.name}
              </span>
              <ColumnHeaderMenu
                field={field}
                tableId={tableId}
                onHideField={(id) => onHideField?.(id)}
                onFilterByField={(id) => onFilterByField?.(id)}
                onDuplicated={noop}
                onDeleted={noop}
              />
              <div
                className="absolute top-0 right-0 z-10 h-full w-[5px] cursor-col-resize"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  document.body.style.userSelect = "none";
                  document.body.style.cursor = "col-resize";
                  header.getResizeHandler()(e); // TanStack handles mousemove/mouseup internally
                  const cleanup = () => {
                    document.body.style.userSelect = "";
                    document.body.style.cursor = "";
                    document.removeEventListener("mouseup", cleanup);
                  };
                  document.addEventListener("mouseup", cleanup);
                }}
              >
                <div
                  className={`absolute inset-y-0 right-0 w-px transition-colors ${
                    header.column.getIsResizing()
                      ? "bg-[#2d7ff9]"
                      : "bg-transparent group-hover/header:bg-[#2d7ff9]/40"
                  }`}
                />
              </div>
            </div>
          );
        })}

        <div className="relative shrink-0 border-b border-[#d1d1d1]">
          <AddColumnButton tableId={tableId} />
        </div>
        <div className="flex-1 bg-[#f5f5f5]" style={{ height: ROW_HEIGHT }} />
      </div>

      {/* Virtualised rows */}
      <div
        ref={parentRef}
        className="grid-scroll flex-1 overflow-auto bg-[#f5f5f5]"
        onClick={() => {
          setActiveCell(null);
          setSelectedColumn(null);
        }}
        onKeyDown={(e) => {
          if (
            ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
          )
            e.preventDefault();
        }}
      >
        <div
          style={{
            height: rowVirtualizer.getTotalSize() + ROW_HEIGHT,
            width: totalWidth,
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
            const tanStackRow = tanStackRows[virtualRow.index];
            const record = tanStackRow?.original;
            const isSelected = record ? selectedRows.has(record.id) : false;

            // Placeholder for rows not yet loaded — preserves correct column widths.
            if (!record) {
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: virtualRow.start,
                    width: dataWidth,
                    height: ROW_HEIGHT,
                    display: "flex",
                  }}
                  className="border-b border-[#dde1e3] bg-white"
                >
                  <div
                    className="flex shrink-0 items-center justify-center"
                    style={{ width: indexWidth }}
                  >
                    <span className="text-[12px] text-[#616670]">
                      {virtualRow.index + 1}
                    </span>
                  </div>
                  {visibleCols.map((col) => (
                    <div
                      key={col.id}
                      className="shrink-0 border-r border-[#dde1e3]"
                      style={{ width: col.getSize() }}
                    />
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
                <div
                  className="relative flex shrink-0 items-center"
                  style={{ width: indexWidth, height: ROW_HEIGHT }}
                >
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, virtualRow.index)}
                    onDragEnd={handleDragEnd}
                    className={`absolute left-0.5 flex cursor-grab items-center rounded p-0.5 text-[#bbb] transition-opacity hover:bg-[#eee] hover:text-[#888] active:cursor-grabbing ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    <svg
                      width="10"
                      height="16"
                      viewBox="0 0 10 16"
                      fill="currentColor"
                    >
                      <circle cx="3" cy="3" r="1.2" />
                      <circle cx="7" cy="3" r="1.2" />
                      <circle cx="3" cy="8" r="1.2" />
                      <circle cx="7" cy="8" r="1.2" />
                      <circle cx="3" cy="13" r="1.2" />
                      <circle cx="7" cy="13" r="1.2" />
                    </svg>
                  </div>
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-[12px] text-[#616670] transition-opacity ${isSelected ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
                  >
                    {virtualRow.index + 1}
                  </span>
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleRow(record.id)}
                    />
                  </div>
                  <button
                    className={`absolute right-0.5 flex items-center rounded border border-[#ddd] bg-white p-0.5 text-[#aaa] transition-opacity hover:bg-[#f5f5f5] hover:text-[#666] ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 12l8-8M12 4v5M12 4H7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {tanStackRow.getVisibleCells().map((cell, colIndex) => {
                  const fieldId = cell.column.id;
                  const fieldType =
                    cell.column.columnDef.meta?.fieldType ?? "TEXT";
                  const isActive =
                    activeCell?.recordId === record.id &&
                    activeCell?.fieldId === fieldId;
                  const value = cell.getValue() as string | number | null;
                  const matchIdx = searchMatchMap.get(
                    `${record.id}:${fieldId}`,
                  );
                  const isMatch = matchIdx !== undefined;
                  const isActiveMatch = matchIdx === searchIndex;
                  const isColSelected = selectedColumn === fieldId;
                  const isFilteredCol = filteredFieldIds.has(fieldId);
                  const isSortedCol = sortedFieldIds.has(fieldId);

                  return (
                    <div
                      key={cell.id}
                      ref={(el) => setCellRef(record.id, fieldId, el)}
                      className={`relative shrink-0 border-r border-[#dde1e3] ${isActive ? "z-10 shadow-[inset_0_0_0_2px_#1170cb]" : ""}`}
                      style={{
                        width: cell.column.getSize(),
                        height: ROW_HEIGHT,
                        backgroundColor: isActiveMatch
                          ? "#fdd66a"
                          : isMatch
                            ? "#fff3d4"
                            : isFilteredCol
                              ? "#eafceb"
                              : isSortedCol
                                ? "#fff3e9"
                                : isColSelected
                                  ? "#f1f6ff"
                                  : undefined,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColumn(null);
                        setEntryMode("replace");
                        setActiveCell({
                          recordId: record.id,
                          fieldId,
                          rowIndex: virtualRow.index,
                          colIndex,
                        });
                      }}
                    >
                      <CellEditor
                        value={value}
                        fieldType={fieldType}
                        isActive={isActive}
                        entryMode={entryMode}
                        onCommit={(newValue) => {
                          if (record.id.startsWith("temp-")) {
                            const realId = tempToRealId.current.get(record.id);
                            if (realId) {
                              updateCell.mutate({
                                recordId: realId,
                                fieldId,
                                value: newValue,
                              });
                            } else {
                              pendingCellUpdates.current.push({
                                tempId: record.id,
                                fieldId,
                                value: newValue,
                              });
                              utils.record.list.setInfiniteData(
                                listQueryInput,
                                (old) => {
                                  if (!old) return old;
                                  return {
                                    ...old,
                                    pages: old.pages.map((page) => ({
                                      ...page,
                                      records: page.records.map((r) =>
                                        r.id === record.id
                                          ? {
                                              ...r,
                                              data: {
                                                ...r.data,
                                                [fieldId]: newValue,
                                              },
                                            }
                                          : r,
                                      ),
                                    })),
                                  };
                                },
                              );
                            }
                          } else {
                            updateCell.mutate({
                              recordId: record.id,
                              fieldId,
                              value: newValue,
                            });
                          }
                        }}
                        onKeyDown={(e) =>
                          handleKeyDown(e, virtualRow.index, colIndex)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Add row */}
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
              className="flex shrink-0 items-center justify-center"
              style={{ width: indexWidth, height: ROW_HEIGHT }}
            >
              <button
                onClick={handleAddRecord}
                disabled={createRecord.isPending}
                className="flex items-center rounded p-1 text-[#888] transition-colors hover:bg-[#f0f0f0] hover:text-[#555]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            {visibleCols.map((col) => (
              <div
                key={col.id}
                className="shrink-0 border-r border-[#dde1e3]"
                style={{ width: col.getSize(), height: ROW_HEIGHT }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating add-record overlay */}
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
            className="flex items-center gap-1.5 rounded-r-full px-2.5 py-1 text-[#555] transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-60"
            title="Add 100k records"
          >
            {bulkCreate.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#1170cb]" />
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#555]"
              >
                <path
                  d="M2 4h12M2 8h12M2 12h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <span className="text-[12px] font-medium">
              {bulkCreate.isPending ? "Adding..." : "Add..."}
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex h-8 shrink-0 items-center border-t border-black/10 bg-[#f2f4f8] px-4">
        <span className="text-[13px] text-[#1d1f25]">
          {total.toLocaleString()} record{total !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
