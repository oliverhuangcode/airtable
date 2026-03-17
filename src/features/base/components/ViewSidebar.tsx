// src/features/base/components/ViewSidebar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { Loader2, Star, Pencil, Copy, Trash2 } from "lucide-react";
import {
  GridFeatureIcon, MagnifyingGlassIcon, CogIcon, PlusIcon, DotsSixVerticalIcon, OverflowIcon,
} from "~/components/icons/AirtableIcons";
import type { Filter, Sort } from "~/types";

interface Props {
  tableId:        string;
  activeViewId:   string | null;
  search:         string;
  filters:        Filter[];
  sorts:          Sort[];
  hiddenFieldIds: string[];
  onSelectView: (params: {
    viewId:         string;
    filters:        Filter[];
    sorts:          Sort[];
    hiddenFieldIds: string[];
  }) => void;
  onViewIdChange: (id: string) => void;
}

function GridIcon({ active }: { active: boolean }) {
  return <GridFeatureIcon size={16} fill={active ? "rgb(22, 110, 225)" : "#666"} className="shrink-0" />;
}

/* ── View context menu icons ─────────────────────────── */

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="3" width="14" height="13" rx="2" stroke="#dc4c4c" strokeWidth="1.3" fill="none" />
      <path d="M2 7h14" stroke="#dc4c4c" strokeWidth="1.3" />
      <path d="M5 1.5v3M13 1.5v3" stroke="#dc4c4c" strokeWidth="1.3" strokeLinecap="round" />
      <text x="9" y="14" textAnchor="middle" fill="#dc4c4c" fontSize="6" fontWeight="700">31</text>
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="1" fill="#e8760a" />
      <rect x="10" y="2" width="6" height="6" rx="1" fill="#e8760a" />
      <rect x="2" y="10" width="6" height="6" rx="1" fill="#e8760a" />
      <rect x="10" y="10" width="6" height="6" rx="1" fill="#e8760a" />
    </svg>
  );
}

function KanbanIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="4" height="14" rx="1" fill="#20a06a" />
      <rect x="7" y="2" width="4" height="10" rx="1" fill="#20a06a" />
      <rect x="12" y="2" width="4" height="12" rx="1" fill="#20a06a" />
    </svg>
  );
}

function TimelineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="3" width="8" height="3" rx="1" fill="#dc4c4c" />
      <rect x="5" y="7.5" width="10" height="3" rx="1" fill="#dc4c4c" />
      <rect x="3" y="12" width="7" height="3" rx="1" fill="#dc4c4c" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 4.5h12M3 9h12M3 13.5h12" stroke="#2d7ff9" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GanttIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="4" y="3" width="10" height="2.5" rx="1" fill="#0d9488" />
      <rect x="2" y="7.5" width="8" height="2.5" rx="1" fill="#0d9488" />
      <rect x="6" y="12" width="10" height="2.5" rx="1" fill="#0d9488" />
    </svg>
  );
}

function FormIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="1.5" width="12" height="15" rx="2" stroke="#e8760a" strokeWidth="1.3" fill="none" />
      <path d="M6 5.5h6M6 9h6M6 12.5h4" stroke="#e8760a" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SectionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 4h12M3 9h12M3 14h12" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TeamBadge() {
  return (
    <span className="ml-1.5 rounded-full bg-[#e8f4fd] px-2 py-0.5 text-[11px] font-medium text-[#1b6497]">
      Team
    </span>
  );
}

function NewViewGridIcon() {
  return <GridFeatureIcon size={18} fill="#2d7ff9" />;
}

/* ── View context menu ──────────────────────────────── */
function ViewContextMenu({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute right-0 top-full z-50 mt-1 w-[220px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Star className="h-[18px] w-[18px] text-[#666]" />
          Add to &ldquo;My favorites&rdquo;
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Pencil className="h-[18px] w-[18px] text-[#666]" />
          Rename view
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Copy className="h-[18px] w-[18px] text-[#666]" />
          Duplicate view
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#dc2626] hover:bg-[#f5f5f5]">
          <Trash2 className="h-[18px] w-[18px] text-[#dc2626]" />
          Delete view
        </button>
      </div>
    </>
  );
}

/* ── Create new view picker ─────────────────────────── */
function CreateNewViewPicker({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute left-full top-0 z-50 ml-1 w-[260px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <NewViewGridIcon />
          Grid
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <CalendarIcon />
          Calendar
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <GalleryIcon />
          Gallery
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <KanbanIcon />
          Kanban
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <TimelineIcon />
          Timeline
          <TeamBadge />
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <ListIcon />
          List
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <GanttIcon />
          Gantt
          <TeamBadge />
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <FormIcon />
          Form
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <SectionIcon />
          Section
          <TeamBadge />
        </button>
      </div>
    </>
  );
}

/* ── Settings/Options popup ─────────────────────────── */
function OptionsPopup({ onClose }: { onClose: () => void }) {
  const [showPersonal, setShowPersonal] = useState(false);
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute right-0 top-full z-50 mt-1 w-[280px] rounded-lg border border-[#e0e0e0] bg-white py-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="px-4 pb-2 text-[14px] font-semibold text-[#1d1f25]">Options</div>
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-[13px] text-[#1d1f25]">Show everyone&apos;s personal views</span>
          <button
            onClick={() => setShowPersonal((v) => !v)}
            className={`relative h-[20px] w-[36px] rounded-full transition-colors ${showPersonal ? "bg-[#2d7ff9]" : "bg-[#ccc]"}`}
          >
            <span
              className={`absolute top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow transition-transform ${showPersonal ? "translate-x-[18px]" : "translate-x-[2px]"}`}
            />
          </button>
        </div>
      </div>
    </>
  );
}

export function ViewSidebar({
  tableId,
  activeViewId,
  filters,
  sorts,
  hiddenFieldIds,
  onSelectView,
  onViewIdChange,
}: Props) {
  const [creating, setCreating]       = useState(false);
  const [newName, setNewName]         = useState("");
  const [viewSearch, setViewSearch]   = useState("");
  const [contextMenuViewId, setContextMenuViewId] = useState<string | null>(null);
  const [showCreatePicker, setShowCreatePicker]     = useState(false);
  const [showOptions, setShowOptions]               = useState(false);
  const [favouriteViewIds, setFavouriteViewIds]     = useState<Set<string>>(new Set());

  const utils = api.useUtils();
  const { data: views = [] } = api.view.getByTable.useQuery({ tableId });

  const filtersRef        = useRef(filters);
  const sortsRef          = useRef(sorts);
  const hiddenFieldIdsRef = useRef(hiddenFieldIds);
  const activeViewIdRef   = useRef(activeViewId);

  useEffect(() => { filtersRef.current        = filters;        }, [filters]);
  useEffect(() => { sortsRef.current          = sorts;          }, [sorts]);
  useEffect(() => { hiddenFieldIdsRef.current = hiddenFieldIds; }, [hiddenFieldIds]);
  useEffect(() => { activeViewIdRef.current   = activeViewId;   }, [activeViewId]);

  const updateConfig = api.view.updateConfig.useMutation({
    onSuccess: () => void utils.view.getByTable.invalidate({ tableId }),
  });

  const saveCurrentView = async (viewId: string) => {
    await updateConfig.mutateAsync({
      id:           viewId,
      filters:      filtersRef.current,
      sorts:        sortsRef.current,
      hiddenFields: hiddenFieldIdsRef.current,
    });
  };

  const createView = api.view.create.useMutation({
    onSuccess: async (view) => {
      void utils.view.getByTable.invalidate({ tableId });
      setCreating(false);
      setNewName("");
      await saveCurrentView(view.id);
      onViewIdChange(view.id);
    },
  });

  // Auto-save debounced
  const isFirstRender = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!activeViewIdRef.current) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (!activeViewIdRef.current) return;
      updateConfig.mutate({
        id:           activeViewIdRef.current,
        filters:      filtersRef.current,
        sorts:        sortsRef.current,
        hiddenFields: hiddenFieldIdsRef.current,
      });
    }, 600);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sorts, hiddenFieldIds]);

  const handleSelectView = async (viewId: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    if (activeViewIdRef.current) {
      await saveCurrentView(activeViewIdRef.current);
    }

    const full = await utils.view.getById.fetch({ id: viewId }, { staleTime: 0 });

    onSelectView({
      viewId:         full.id,
      filters:        full.filters,
      sorts:          full.sorts,
      hiddenFieldIds: full.hiddenFields,
    });
  };

  const handleCreate = () => {
    const name = newName.trim() || `Grid ${views.length + 1}`;
    createView.mutate({ tableId, name });
  };

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col bg-white px-2 py-2.5">
      {/* Create new button */}
      <div className="relative">
        <button
          onClick={() => setShowCreatePicker((v) => !v)}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] text-[#1d1f25] transition-colors hover:bg-black/5"
        >
          <PlusIcon size={16} className="text-[#666]" />
          <span>Create new...</span>
        </button>
        {showCreatePicker && (
          <CreateNewViewPicker onClose={() => setShowCreatePicker(false)} />
        )}
      </div>

      {/* Find a view */}
      <div className="flex items-center gap-2 px-3 pb-3 mt-0.5">
        <div className="flex flex-1 items-center gap-1.5 bg-white px-2 py-1.5">
          <MagnifyingGlassIcon size={14} className="shrink-0 text-[#999]" />
          <input
            value={viewSearch}
            onChange={(e) => setViewSearch(e.target.value)}
            placeholder="Find a view"
            className="min-w-0 flex-1 bg-transparent text-[12px] text-[#1d1f25] outline-none placeholder:text-[#999]"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowOptions((v) => !v)}
            className="rounded p-1 text-[#999] hover:bg-[#f0f0f0] hover:text-[#555]"
          >
            <CogIcon size={16} />
          </button>
          {showOptions && (
            <OptionsPopup onClose={() => setShowOptions(false)} />
          )}
        </div>
      </div>

      {/* Views list */}
      <div className="flex-1 overflow-y-auto py-0.5">
        {views.filter((v) => !viewSearch.trim() || v.name.toLowerCase().includes(viewSearch.trim().toLowerCase())).map((view) => {
          const isActive = view.id === activeViewId;
          return (
            <div key={view.id} className="relative">
              <button
                onClick={() => handleSelectView(view.id)}
                className={`group flex w-full items-center gap-1.5 rounded-[3px] px-2 py-2 text-left transition-colors ${
                  isActive
                    ? "bg-black/5 text-[#1d1f25]"
                    : "text-[#1d1f25] hover:bg-black/5"
                }`}
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavouriteViewIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(view.id)) next.delete(view.id);
                      else next.add(view.id);
                      return next;
                    });
                  }}
                  className={`shrink-0 cursor-pointer rounded p-0.5 transition-opacity hover:text-[#f5a623] ${
                    favouriteViewIds.has(view.id)
                      ? "text-[#f5a623] opacity-100"
                      : "text-[#ccc] opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <Star className={`h-4 w-4 ${favouriteViewIds.has(view.id) ? "fill-[#f5a623]" : ""}`} />
                </span>
                <GridIcon active={isActive} />
                <span className="flex-1 truncate text-[13px]">{view.name}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setContextMenuViewId(contextMenuViewId === view.id ? null : view.id);
                  }}
                  className="shrink-0 cursor-pointer rounded p-0.5 text-[#999] opacity-0 transition-opacity hover:bg-black/5 group-hover:opacity-100"
                >
                  <OverflowIcon size={16} />
                </span>
                <DotsSixVerticalIcon size={16} className="shrink-0 text-[#ccc] opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
              {contextMenuViewId === view.id && (
                <ViewContextMenu onClose={() => setContextMenuViewId(null)} />
              )}
            </div>
          );
        })}
      </div>

      {/* Create new view form */}
      {creating && (
        <div className="border-t border-[#ddd] bg-white px-3 py-3">
          <div className="flex flex-col gap-2">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") { setCreating(false); setNewName(""); }
              }}
              placeholder="View name"
              className="w-full rounded border border-[#ddd] bg-white px-2.5 py-1.5 text-[13px] outline-none focus:border-[#2d7ff9]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={createView.isPending}
                className="flex flex-1 items-center justify-center gap-1 rounded bg-[#2d7ff9] py-1.5 text-[13px] font-medium text-white disabled:opacity-50"
              >
                {createView.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Create view"}
              </button>
              <button
                onClick={() => { setCreating(false); setNewName(""); }}
                className="rounded border border-[#ddd] bg-white px-3 py-1.5 text-[13px] text-[#666] hover:bg-[#f9f9f9]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
