"use client";

import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "~/features/hooks/useClickOutside";
import { api } from "~/trpc/react";
import {
  PlusIcon,
  SpinnerIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  CheckBoldIcon,
  DotsThreeVerticalIcon,
  PencilIcon,
  XIcon,
  TrashIcon,
  UploadIcon,
  EyeSlashIcon,
  SlidersIcon,
  CopyIcon,
  InfoIcon,
  LockIcon,
} from "~/components/icons/AirtableIcons";
import type { TableSummary } from "~/types";
import { ToolsDropdown } from "./Toolbar";

interface Props {
  baseId: string;
  tables: TableSummary[];
  activeTableId: string | null;
  onSelectTable: (id: string) => void;
  onRequestClearData: (tableId: string) => void;
}

export function TableTabs({
  baseId,
  tables,
  activeTableId,
  onSelectTable,
  onRequestClearData,
}: Props) {
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


  const handleCreate = () => {
    if (!newName.trim()) return;
    createTable.mutate({ name: newName.trim(), baseId });
  };

  useClickOutside(
    dropdownRef,
    () => {
      setShowDropdown(false);
      setDropdownSearch("");
    },
    showDropdown,
  );
  useClickOutside(tableMenuWrapperRef, () => setTableMenu(null), !!tableMenu);

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
            <div
              key={table.id}
              ref={tableMenu === table.id ? tableMenuWrapperRef : undefined}
              className="relative flex items-end"
            >
              {isRenaming ? (
                <div className="z-10 -mb-px flex items-center rounded-t border-t border-r border-l border-[#ddd] bg-white px-1 py-1">
                  <input
                    ref={renameInputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && renameValue.trim()) {
                        renameTable.mutate({
                          id: table.id,
                          name: renameValue.trim(),
                        });
                      }
                      if (e.key === "Escape") setRenaming(null);
                    }}
                    onBlur={() => {
                      if (
                        renameValue.trim() &&
                        renameValue.trim() !== table.name
                      ) {
                        renameTable.mutate({
                          id: table.id,
                          name: renameValue.trim(),
                        });
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
                  className={`relative flex items-center gap-1 px-3 py-1.5 text-[13px] transition-colors ${
                    isActive
                      ? "z-10 -mb-px rounded-t border-t border-r border-l border-black/10 bg-white font-medium text-[#1d1f25]"
                      : "rounded-t text-black/65 hover:bg-[#c9f0f7] hover:text-[#1d1f25]"
                  } `}
                >
                  {table.name}
                  {isActive && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setTableMenu(tableMenu === table.id ? null : table.id);
                      }}
                    >
                      <ChevronDownIcon size={12} className="text-[#888]" />
                    </span>
                  )}
                </button>
              )}

              {tableMenu === table.id && (
                <div className="absolute top-full left-0 z-30 mt-0.5 w-60 rounded-lg border border-[#ddd] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
                  <div className="py-1.5">
                    <button className="flex w-full items-center justify-between px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <span className="flex items-center gap-3">
                        <UploadIcon
                          size={16}
                          className="shrink-0 text-[#666]"
                        />
                        Import data
                      </span>
                      <ChevronRightIcon size={14} className="text-[#999]" />
                    </button>
                  </div>

                  <div className="mx-3 border-t border-[#eee]" />

                  <div className="py-1.5">
                    <button
                      onClick={() => {
                        setTableMenu(null);
                        setRenaming(table.id);
                        setRenameValue(table.name);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]"
                    >
                      <PencilIcon size={16} className="shrink-0 text-[#666]" />
                      Rename table
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <EyeSlashIcon
                        size={16}
                        className="shrink-0 text-[#666]"
                      />
                      Hide table
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <SlidersIcon size={16} className="shrink-0 text-[#666]" />
                      Manage fields
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <CopyIcon size={16} className="shrink-0 text-[#666]" />
                      Duplicate table
                    </button>
                  </div>

                  <div className="mx-3 border-t border-[#eee]" />

                  <div className="py-1.5">
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="shrink-0 text-[#666]"
                      >
                        <path
                          d="M2 4h12M4 8h8M6 12h4"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="13"
                          cy="12"
                          r="2.5"
                          stroke="currentColor"
                          strokeWidth="1.3"
                        />
                      </svg>
                      Configure date dependencies
                    </button>
                  </div>

                  <div className="mx-3 border-t border-[#eee]" />

                  <div className="py-1.5">
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <InfoIcon size={16} className="shrink-0 text-[#666]" />
                      Edit table description
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]">
                      <LockIcon size={16} className="shrink-0 text-[#666]" />
                      Edit table permissions
                    </button>
                  </div>

                  <div className="mx-3 border-t border-[#eee]" />

                  <div className="py-1.5">
                    <button
                      onClick={() => {
                        setTableMenu(null);
                        onRequestClearData(table.id);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#333] hover:bg-[#f5f5f5]"
                    >
                      <XIcon size={16} className="shrink-0 text-[#666]" />
                      Clear data
                    </button>
                    <button
                      onClick={() => {
                        if (tables.length <= 1) {
                          alert("Cannot delete the only table.");
                          return;
                        }
                        if (
                          confirm(
                            `Delete table "${table.name}"? This cannot be undone.`,
                          )
                        ) {
                          setTableMenu(null);
                          deleteTable.mutate({ id: table.id });
                        }
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-[#999] hover:bg-[#f5f5f5]"
                    >
                      <TrashIcon size={16} className="shrink-0" />
                      Delete table
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setShowDropdown((v) => !v);
              setDropdownSearch("");
            }}
            className="flex items-center rounded-t px-2 py-1.5 text-[#888] hover:bg-[#eee] hover:text-[#666]"
          >
            <ChevronDownIcon size={14} />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 z-30 mt-0.5 w-[320px] rounded-lg border border-[#ddd] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              <div className="flex items-center gap-2 border-b border-[#eee] px-3 py-2.5">
                <MagnifyingGlassIcon
                  size={16}
                  className="shrink-0 text-[#999]"
                />
                <input
                  value={dropdownSearch}
                  onChange={(e) => setDropdownSearch(e.target.value)}
                  placeholder="Find a table"
                  className="w-full bg-transparent text-[14px] text-[#1f1f1f] outline-none placeholder:text-[#999]"
                  autoFocus
                />
              </div>

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
                        <CheckBoldIcon
                          size={16}
                          className="shrink-0 text-[#333]"
                        />
                      ) : (
                        <span className="h-4 w-4 shrink-0" />
                      )}
                      <span
                        className={`flex-1 text-[14px] ${isActive ? "font-medium text-[#1f1f1f]" : "text-[#333]"}`}
                      >
                        {table.name}
                      </span>
                      {isActive && (
                        <DotsThreeVerticalIcon
                          size={16}
                          className="shrink-0 text-[#999]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-[#eee] py-1">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setIsAdding(true);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-[#f5f5f5]"
                >
                  <div className="flex items-center gap-2">
                    <PlusIcon size={16} className="shrink-0 text-[#666]" />
                    <span className="text-[14px] text-[#333]">Add table</span>
                  </div>
                  <ChevronRightIcon size={16} className="text-[#999]" />
                </button>
              </div>
            </div>
          )}
        </div>

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
              {createTable.isPending ? <SpinnerIcon size={12} /> : "Add"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 rounded-t px-2.5 py-1.5 text-black/65 transition-colors hover:bg-[#c9f0f7] hover:text-[#1d1f25]"
          >
            <PlusIcon size={14} />
            <span className="text-[13px]">Add or import</span>
          </button>
        )}
      </div>

      {/* Right side - Tools */}
      <div className="relative flex items-end pr-2 pb-1.5">
        <button
          onClick={() => setShowTools((v) => !v)}
          className="flex items-center gap-0.5 px-2 text-[13px] text-black/65 transition-colors hover:text-[#1d1f25]"
        >
          <span>Tools</span>
          <ChevronDownIcon size={12} />
        </button>
        {showTools && <ToolsDropdown onClose={() => setShowTools(false)} />}
      </div>
    </div>
  );
}
