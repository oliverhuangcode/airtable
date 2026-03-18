"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { Loader2, Star, Pencil, Copy, Trash2 } from "lucide-react";
import {
  GridFeatureIcon,
  MagnifyingGlassIcon,
  CogIcon,
  PlusIcon,
  DotsSixVerticalIcon,
  OverflowIcon,
} from "~/components/icons/AirtableIcons";
import type { Filter, Sort } from "~/types";
import { VIEW_CONFIG_DEBOUNCE_MS } from "~/lib/constants";

interface Props {
  tableId: string;
  activeViewId: string | null;
  search: string;
  filters: Filter[];
  sorts: Sort[];
  hiddenFieldIds: string[];
  onSelectView: (params: {
    viewId: string;
    filters: Filter[];
    sorts: Sort[];
    hiddenFieldIds: string[];
  }) => void;
  onViewIdChange: (id: string) => void;
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <GridFeatureIcon
      size={16}
      fill={active ? "rgb(22, 110, 225)" : "#666"}
      className="shrink-0"
    />
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="3"
        width="14"
        height="13"
        rx="2"
        stroke="#dc4c4c"
        strokeWidth="1.3"
        fill="none"
      />
      <path d="M2 7h14" stroke="#dc4c4c" strokeWidth="1.3" />
      <path
        d="M5 1.5v3M13 1.5v3"
        stroke="#dc4c4c"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <text
        x="9"
        y="14"
        textAnchor="middle"
        fill="#dc4c4c"
        fontSize="6"
        fontWeight="700"
      >
        31
      </text>
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="1" fill="#7c37ef" />
      <rect x="10" y="2" width="6" height="6" rx="1" fill="#7c37ef" />
      <rect x="2" y="10" width="6" height="6" rx="1" fill="#7c37ef" />
      <rect x="10" y="10" width="6" height="6" rx="1" fill="#7c37ef" />
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
      <path
        d="M3 4.5h12M3 9h12M3 13.5h12"
        stroke="#2d7ff9"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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
      <rect
        x="3"
        y="1.5"
        width="12"
        height="15"
        rx="2"
        stroke="#dd04a8"
        strokeWidth="1.3"
        fill="none"
      />
      <path
        d="M6 5.5h6M6 9h6M6 12.5h4"
        stroke="#dd04a8"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3 4h12M3 9h12M3 14h12"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

function ViewContextMenu({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[220px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
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

function CreateNewViewPicker({
  onClose,
  onSelect,
  anchorRect,
}: {
  onClose: () => void;
  onSelect: (type: string) => void;
  anchorRect: DOMRect;
}) {
  const btn =
    "flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]";
  const pick = (type: string) => {
    onClose();
    onSelect(type);
  };
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div
        className="fixed z-50 w-[260px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        style={{ top: anchorRect.top, left: anchorRect.right + 4 }}
      >
        <button className={btn} onClick={() => pick("Grid")}>
          <NewViewGridIcon />
          Grid
        </button>
        <button className={btn} onClick={() => pick("Calendar")}>
          <CalendarIcon />
          Calendar
        </button>
        <button className={btn} onClick={() => pick("Gallery")}>
          <GalleryIcon />
          Gallery
        </button>
        <button className={btn} onClick={() => pick("Kanban")}>
          <KanbanIcon />
          Kanban
        </button>
        <button className={btn} onClick={() => pick("Timeline")}>
          <TimelineIcon />
          Timeline
          <TeamBadge />
        </button>
        <button className={btn} onClick={() => pick("List")}>
          <ListIcon />
          List
        </button>
        <button className={btn} onClick={() => pick("Gantt")}>
          <GanttIcon />
          Gantt
          <TeamBadge />
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className={btn} onClick={() => pick("Form")}>
          <FormIcon />
          Form
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className={btn} onClick={() => pick("Section")}>
          <SectionIcon />
          Section
          <TeamBadge />
        </button>
      </div>
    </>
  );
}

function CreateViewModal({
  initialName,
  anchorRect,
  isPending,
  onConfirm,
  onCancel,
}: {
  initialName: string;
  anchorRect: DOMRect;
  isPending: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [editMode, setEditMode] = useState<
    "collaborative" | "personal" | "locked"
  >("collaborative");

  const editModeDesc: Record<typeof editMode, string> = {
    collaborative: "All collaborators can edit the configuration",
    personal: "Only you can see this view's configuration",
    locked: "No one can edit the configuration",
  };

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onCancel} />
      <div
        className="fixed z-50 w-[380px] rounded-xl border border-[#e0e0e0] bg-white p-5 shadow-[0_8px_32px_rgba(0,0,0,0.16)]"
        style={{ top: anchorRect.top, left: anchorRect.right + 4 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Name input */}
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isPending)
              onConfirm(name.trim() || initialName);
            if (e.key === "Escape") onCancel();
          }}
          className="mb-5 w-full rounded-lg border border-[#d0d0d0] px-3 py-2.5 text-[16px] font-semibold text-[#1d1f25] outline-none focus:border-[#2d7ff9] focus:ring-2 focus:ring-[#2d7ff9]/20"
        />

        {/* Who can edit */}
        <div className="mb-1 text-[14px] font-semibold text-[#1d1f25]">
          Who can edit
        </div>
        <div className="mb-1 flex items-center gap-5">
          {(["collaborative", "personal", "locked"] as const).map((mode) => (
            <label
              key={mode}
              className="flex cursor-pointer items-center gap-1.5"
            >
              <div
                onClick={() => setEditMode(mode)}
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
                  editMode === mode ? "border-[#2d7ff9]" : "border-[#ccc]"
                }`}
              >
                {editMode === mode && (
                  <div className="h-2 w-2 rounded-full bg-[#2d7ff9]" />
                )}
              </div>
              <span className="text-[13px] text-[#1d1f25] capitalize">
                {mode}
              </span>
            </label>
          ))}
        </div>
        <div className="mb-5 text-[12px] text-[#888]">
          {editModeDesc[editMode]}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-[14px] font-medium text-[#1d1f25] hover:bg-[#f5f5f5]"
          >
            Cancel
          </button>
          <button
            onClick={() => !isPending && onConfirm(name.trim() || initialName)}
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-[#2d7ff9] px-5 py-2 text-[14px] font-semibold text-white hover:bg-[#1a6fe8] disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Create new view"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

function OptionsPopup({ onClose }: { onClose: () => void }) {
  const [showPersonal, setShowPersonal] = useState(false);
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[280px] rounded-lg border border-[#e0e0e0] bg-white py-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="px-4 pb-2 text-[14px] font-semibold text-[#1d1f25]">
          Options
        </div>
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-[13px] text-[#1d1f25]">
            Show everyone&apos;s personal views
          </span>
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
  const [viewSearch, setViewSearch] = useState("");
  const [contextMenuViewId, setContextMenuViewId] = useState<string | null>(
    null,
  );
  const [showCreatePicker, setShowCreatePicker] = useState(false);
  const [pickerAnchor, setPickerAnchor] = useState<DOMRect | null>(null);
  const [createModalName, setCreateModalName] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [favouriteViewIds, setFavouriteViewIds] = useState<Set<string>>(
    new Set(),
  );
  const createBtnRef = useRef<HTMLButtonElement>(null);

  const utils = api.useUtils();
  const { data: views = [] } = api.view.getByTable.useQuery({ tableId });

  const filtersRef = useRef(filters);
  const sortsRef = useRef(sorts);
  const hiddenFieldIdsRef = useRef(hiddenFieldIds);
  const activeViewIdRef = useRef(activeViewId);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  useEffect(() => {
    sortsRef.current = sorts;
  }, [sorts]);
  useEffect(() => {
    hiddenFieldIdsRef.current = hiddenFieldIds;
  }, [hiddenFieldIds]);
  useEffect(() => {
    activeViewIdRef.current = activeViewId;
  }, [activeViewId]);

  const updateConfig = api.view.updateConfig.useMutation({
    onSuccess: () => void utils.view.getByTable.invalidate({ tableId }),
  });

  const saveCurrentView = async (viewId: string) => {
    await updateConfig.mutateAsync({
      id: viewId,
      filters: filtersRef.current,
      sorts: sortsRef.current,
      hiddenFields: hiddenFieldIdsRef.current,
    });
  };

  const createView = api.view.create.useMutation({
    onSuccess: async (view) => {
      void utils.view.getByTable.invalidate({ tableId });
      setCreateModalName(null);
      await saveCurrentView(view.id);
      onViewIdChange(view.id);
    },
  });

  // Debounced auto-save: 600ms after any filter/sort/hidden-field change.
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
        id: activeViewIdRef.current,
        filters: filtersRef.current,
        sorts: sortsRef.current,
        hiddenFields: hiddenFieldIdsRef.current,
      });
    }, VIEW_CONFIG_DEBOUNCE_MS);

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

    const full = await utils.view.getById.fetch(
      { id: viewId },
      { staleTime: 0 },
    );

    onSelectView({
      viewId: full.id,
      filters: full.filters,
      sorts: full.sorts,
      hiddenFieldIds: full.hiddenFields,
    });
  };

  const getDefaultName = (type: string) => {
    const count = views.filter((v) =>
      v.name.toLowerCase().startsWith(type.toLowerCase()),
    ).length;
    return count === 0 ? type : `${type} ${count + 1}`;
  };

  const handleCreate = (name: string) => {
    createView.mutate({ tableId, name });
  };

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col bg-white px-2 py-2.5">
      <div className="relative">
        <button
          ref={createBtnRef}
          onClick={() => {
            const rect = createBtnRef.current?.getBoundingClientRect();
            if (rect) setPickerAnchor(rect);
            setShowCreatePicker((v) => !v);
          }}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] text-[#1d1f25] transition-colors hover:bg-black/5"
        >
          <PlusIcon size={16} className="text-[#666]" />
          <span>Create new...</span>
        </button>
        {showCreatePicker && pickerAnchor && (
          <CreateNewViewPicker
            onClose={() => setShowCreatePicker(false)}
            onSelect={(type) => setCreateModalName(getDefaultName(type))}
            anchorRect={pickerAnchor}
          />
        )}
        {createModalName !== null && pickerAnchor && (
          <CreateViewModal
            initialName={createModalName}
            anchorRect={pickerAnchor}
            isPending={createView.isPending}
            onConfirm={handleCreate}
            onCancel={() => setCreateModalName(null)}
          />
        )}
      </div>

      <div className="mt-0.5 flex items-center gap-2 px-3 pb-3">
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

      <div className="flex-1 overflow-y-auto py-0.5">
        {views
          .filter(
            (v) =>
              !viewSearch.trim() ||
              v.name.toLowerCase().includes(viewSearch.trim().toLowerCase()),
          )
          .map((view) => {
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
                    <Star
                      className={`h-4 w-4 ${favouriteViewIds.has(view.id) ? "fill-[#f5a623]" : ""}`}
                    />
                  </span>
                  <GridIcon active={isActive} />
                  <span className="flex-1 truncate text-[13px]">
                    {view.name}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setContextMenuViewId(
                        contextMenuViewId === view.id ? null : view.id,
                      );
                    }}
                    className="shrink-0 cursor-pointer rounded p-0.5 text-[#999] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/5"
                  >
                    <OverflowIcon size={16} />
                  </span>
                  <DotsSixVerticalIcon
                    size={16}
                    className="shrink-0 text-[#ccc] opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </button>
                {contextMenuViewId === view.id && (
                  <ViewContextMenu onClose={() => setContextMenuViewId(null)} />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
