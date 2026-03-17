// src/features/base/components/TableTabs.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "~/trpc/react";
import { Plus, Loader2, ChevronDown, ChevronRight, Search, Check, MoreVertical, Pencil, X, Trash2, Upload, EyeOff, SlidersHorizontal, Copy, Info, Lock } from "lucide-react";
import type { TableSummary } from "~/types";
import { ToolsDropdown } from "./Toolbar";

interface Props {
  baseId: string;
  tables: TableSummary[];
  activeTableId: string | null;
  onSelectTable: (id: string) => void;
}

export function TableTabs({ baseId, tables, activeTableId, onSelectTable }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [tableMenu, setTableMenu] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showTools, setShowTools] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tableMenuWrapperRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const utils = api.useUtils();

  const createTable = api.table.create.useMutation({
    onSuccess: (newTable) => {
      void utils.base.getById.invalidate({ id: baseId });
      setNewName("");
      setIsAdding(false);
      setShowDropdown(false);
      onSelectTable(newTable.id);
    },
  });

  const renameTable = api.table.rename.useMutation({
    onSuccess: () => {
      void utils.base.getById.invalidate({ id: baseId });
      setRenaming(null);
    },
  });

  const deleteTable = api.table.delete.useMutation({
    onSuccess: (deleted) => {
      void utils.base.getById.invalidate({ id: baseId });
      if (activeTableId === deleted.id) {
        const remaining = tables.filter((t) => t.id !== deleted.id);
        if (remaining[0]) onSelectTable(remaining[0].id);
      }
    },
  });

  const clearData = api.table.clearData.useMutation({
    onSuccess: () => {
      void utils.record.list.invalidate();
      void utils.record.count.invalidate();
      setTableMenu(null);
    },
  });

  const handleCreate = () => {
    if (!newName.trim()) return;
    createTable.mutate({ name: newName.trim(), baseId });
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setDropdownSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  // Close table menu on outside click
  useEffect(() => {
    if (!tableMenu) return;
    const handler = (e: MouseEvent) => {
      if (tableMenuWrapperRef.current && !tableMenuWrapperRef.current.contains(e.target as Node)) {
        setTableMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [tableMenu]);

  // Focus rename input
  useEffect(() => {
    if (renaming) renameInputRef.current?.focus();
  }, [renaming]);

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(dropdownSearch.toLowerCase()),
  );

  return (
    <div className="flex h-[32px] shrink-0 items-end justify-between border-b border-black/10 bg-[#e3fafd] px-0">
      <div className="flex items-end gap-0 pl-1">
        {tables.map((table) => {
          const isActive = activeTableId === table.id;
          const isRenaming = renaming === table.id;
          return (
            <div key={table.id} ref={tableMenu === table.id ? tableMenuWrapperRef : undefined} className="relative flex items-end">
              {isRenaming ? (
                <div className="flex items-center rounded-t border-t border-l border-r border-[#ddd] bg-white px-1 py-1 -mb-px z-10">
                  <input
                    ref={renameInputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && renameValue.trim()) {
                        renameTable.mutate({ id: table.id, name: renameValue.trim() });
                      }
                      if (e.key === "Escape") setRenaming(null);
                    }}
                    onBlur={() => {
                      if (renameValue.trim() && renameValue.trim() !== table.name) {
                        renameTable.mutate({ id: table.id, name: renameValue.trim() });
                      } else {
                        setRenaming(null);
                      }
                    }}
                    className="w-28 rounded border border-[#2d7ff9] px-2 py-0.5 text-[13px] outline-none"
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    onSelectTable(table.id);
                    setTableMenu(null);
                  }}
                  className={`
                    relative flex items-center gap-1 px-3 py-1.5 text-[13px] transition-colors
                    ${
                      isActive
                        ? "rounded-t bg-white text-[#1d1f25] font-medium border-t border-l border-r border-black/10 -mb-px z-10"
                        : "text-black/65 hover:text-[#1d1f25] hover:bg-[#c9f0f7] rounded-t"
                    }
                  `}
                >
                  {table.name}
                  {isActive && (
                    <ChevronDown
                      className="h-3 w-3 text-[#888]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTableMenu(tableMenu === table.id ? null : table.id);
                      }}
                    />
                  )}
                </button>
              )}

              {/* Table context menu */}
              {tableMenu === table.id && (
                <div
                  className="absolute left-0 top-full z-30 mt-0.5 w-60 rounded-lg border border-[#ddd] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                >
                  {/* Import data */}
                  <div className="py-1.5">
                    <button className="flex w-full items-center justify-between px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <span className="flex items-center gap-3">
                        <Upload className="h-4 w-4 shrink-0 text-[#666]" />
                        Import data
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#999]" />
                    </button>
                  </div>

                  <div className="mx-3 border-t border-[#eee]" />

                  {/* Rename / Hide / Manage / Duplicate */}
                  <div className="py-1.5">
                    <button
                      onClick={() => {
                        setTableMenu(null);
                        setRenaming(table.id);
                        setRenameValue(table.name);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]"
                    >
                      <Pencil className="h-4 w-4 shrink-0 text-[#666]" />
                      Rename table
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <EyeOff className="h-4 w-4 shrink-0 text-[#666]" />
                      Hide table
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#666]" />
                      Manage fields
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <Copy className="h-4 w-4 shrink-0 text-[#666]" />
                      Duplicate table
                    </button>
                  </div>

                  <div className="mx-3 border-t border-[#eee]" />

                  {/* Configure date dependencies */}
                  <div className="py-1.5">
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#666]">
                        <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                        <circle cx="13" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                      Configure date dependencies
                    </button>
                  </div>

                  <div className="mx-3 border-t border-[#eee]" />

                  {/* Edit description / permissions */}
                  <div className="py-1.5">
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <Info className="h-4 w-4 shrink-0 text-[#666]" />
                      Edit table description
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <Lock className="h-4 w-4 shrink-0 text-[#666]" />
                      Edit table permissions
                    </button>
                  </div>

                  <div className="mx-3 border-t border-[#eee]" />

                  {/* Clear data / Delete table */}
                  <div className="py-1.5">
                    <button
                      onClick={() => {
                        if (confirm("Clear all data in this table? This cannot be undone.")) {
                          clearData.mutate({ id: table.id });
                        }
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]"
                    >
                      <X className="h-4 w-4 shrink-0 text-[#666]" />
                      Clear data
                    </button>
                    <button
                      onClick={() => {
                        if (tables.length <= 1) {
                          alert("Cannot delete the only table.");
                          return;
                        }
                        if (confirm(`Delete table "${table.name}"? This cannot be undone.`)) {
                          setTableMenu(null);
                          deleteTable.mutate({ id: table.id });
                        }
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#999] hover:bg-[#f5f5f5]"
                    >
                      <Trash2 className="h-4 w-4 shrink-0" />
                      Delete table
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Table dropdown trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setShowDropdown((v) => !v); setDropdownSearch(""); }}
            className="flex items-center rounded-t px-2 py-1.5 text-[#888] hover:bg-[#eee] hover:text-[#666]"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 top-full z-30 mt-0.5 w-[320px] rounded-lg border border-[#ddd] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              {/* Search */}
              <div className="flex items-center gap-2 border-b border-[#eee] px-3 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-[#999]" />
                <input
                  value={dropdownSearch}
                  onChange={(e) => setDropdownSearch(e.target.value)}
                  placeholder="Find a table"
                  className="w-full bg-transparent text-[14px] text-[#1f1f1f] outline-none placeholder:text-[#999]"
                  autoFocus
                />
              </div>

              {/* Table list */}
              <div className="max-h-[280px] overflow-y-auto py-1">
                {filteredTables.map((table) => {
                  const isActive = activeTableId === table.id;
                  return (
                    <button
                      key={table.id}
                      onClick={() => {
                        onSelectTable(table.id);
                        setShowDropdown(false);
                        setDropdownSearch("");
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[#f5f5f5] ${
                        isActive ? "bg-[#f5f5f5]" : ""
                      }`}
                    >
                      {isActive ? (
                        <Check className="h-4 w-4 shrink-0 text-[#333]" />
                      ) : (
                        <span className="h-4 w-4 shrink-0" />
                      )}
                      <span className={`flex-1 text-[14px] ${isActive ? "font-medium text-[#1f1f1f]" : "text-[#333]"}`}>
                        {table.name}
                      </span>
                      {isActive && (
                        <MoreVertical className="h-4 w-4 shrink-0 text-[#999]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Add table */}
              <div className="border-t border-[#eee] py-1">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setIsAdding(true);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-[#f5f5f5]"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 shrink-0 text-[#666]" />
                    <span className="text-[14px] text-[#333]">Add table</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#999]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add or import */}
        {isAdding ? (
          <div className="flex items-center gap-1 px-2 pb-1">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setIsAdding(false);
              }}
              placeholder="Table name..."
              className="w-28 rounded border border-[#2d7ff9] px-2 py-0.5 text-[12px] outline-none"
            />
            <button
              onClick={handleCreate}
              disabled={createTable.isPending || !newName.trim()}
              className="rounded bg-[#2d7ff9] px-2 py-0.5 text-[12px] text-white disabled:opacity-50"
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
            className="flex items-center gap-1 rounded-t px-2.5 py-1.5 text-black/65 transition-colors hover:bg-[#c9f0f7] hover:text-[#1d1f25]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="text-[13px]">Add or import</span>
          </button>
        )}
      </div>

      {/* Right side - Tools */}
      <div className="relative flex items-end pb-1.5 pr-2">
        <button
          onClick={() => setShowTools((v) => !v)}
          className="flex items-center gap-0.5 px-2 text-[13px] text-black/65 transition-colors hover:text-[#1d1f25]"
        >
          <span>Tools</span>
          <ChevronDown className="h-3 w-3" />
        </button>
        {showTools && (
          <ToolsDropdown onClose={() => setShowTools(false)} />
        )}
      </div>
    </div>
  );
}
