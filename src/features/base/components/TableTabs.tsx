// src/features/base/components/TableTabs.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Plus, Loader2 } from "lucide-react";
import type { TableSummary } from "~/types";

interface Props {
  baseId: string;
  tables: TableSummary[];
  activeTableId: string | null;
  onSelectTable: (id: string) => void;
}

export function TableTabs({ baseId, tables, activeTableId, onSelectTable }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const utils = api.useUtils();

  // ── WRITE: create table ───────────────────────────────────────────────────
  const createTable = api.table.create.useMutation({
    onSuccess: (newTable) => {
      // invalidate base so tab list updates
      void utils.base.getById.invalidate({ id: baseId });
      setNewName("");
      setIsAdding(false);
      onSelectTable(newTable.id);
    },
  });

  const handleCreate = () => {
    if (!newName.trim()) return;
    createTable.mutate({ name: newName.trim(), baseId });
  };

  return (
    <div className="flex h-10 shrink-0 items-end border-b border-[#e0e0e0] bg-white px-2">
      <div className="flex items-end gap-0.5">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onSelectTable(table.id)}
            className={`
              relative px-4 py-2 text-[13px] font-medium rounded-t transition-colors
              ${
                activeTableId === table.id
                  ? "bg-white text-[#1f1f1f] border border-b-white border-[#e0e0e0] -mb-px"
                  : "text-[#666] hover:bg-[#f4f4f4]"
              }
            `}
          >
            {table.name}
          </button>
        ))}

        {/* Inline add */}
        {isAdding ? (
          <div className="flex items-center gap-1 px-2 pb-1.5">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setIsAdding(false);
              }}
              placeholder="Table name..."
              className="w-28 rounded border border-[#1170cb] px-2 py-1 text-xs outline-none"
            />
            <button
              onClick={handleCreate}
              disabled={createTable.isPending || !newName.trim()}
              className="rounded bg-[#1170cb] px-2 py-1 text-xs text-white disabled:opacity-50"
            >
              {createTable.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Add"
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 pb-2 pt-1.5 text-[#666] hover:text-[#1f1f1f] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
