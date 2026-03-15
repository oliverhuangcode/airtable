// src/features/base/components/ViewSidebar.tsx
"use client";

// src/features/base/components/ViewSidebar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { Search, Settings, LayoutGrid, Loader2, Plus } from "lucide-react";
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

export function ViewSidebar({
  tableId,
  activeViewId,
  filters,
  sorts,
  hiddenFieldIds,
  onSelectView,
  onViewIdChange,
}: Props) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName]   = useState("");

  const utils = api.useUtils();
  const { data: views = [] } = api.view.getByTable.useQuery({ tableId });

  // Keep latest values in refs so async handlers always read current state
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

  // Saves the current view synchronously — returns a promise so callers can await it
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
      // save current toolbar state into the new view immediately
      await saveCurrentView(view.id);
      onViewIdChange(view.id);
    },
  });

  // ── Auto-save: debounced save when config changes while a view is active ──
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

  // ── Switch view: save current first, then load new ────────────────────────
  const handleSelectView = async (viewId: string) => {
    // 1. cancel any pending debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    // 2. flush save of current view before switching
    if (activeViewIdRef.current) {
      await saveCurrentView(activeViewIdRef.current);
    }

    // 3. fetch fresh config for the new view (bypass cache)
    const full = await utils.view.getById.fetch({ id: viewId }, { staleTime: 0 });

    // 4. apply the loaded config
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
    <div className="flex h-full w-67 shrink-0 flex-col border-r border-[#ddd] bg-[#f7f7f7]">
      {/* Create new button */}
      <button
        onClick={() => setCreating(true)}
        className="flex items-center gap-2 px-4 py-3 text-[13px] font-normal text-[#444] transition-colors hover:bg-[#f0f0f0]"
      >
        <Plus className="h-4 w-4 text-[#666]" />
        <span>Create new...</span>
      </button>

      {/* Find a view */}
      <div className="flex items-center gap-2 border-b border-[#ddd] px-3 py-3">
        <div className="flex flex-1 items-center gap-1.5 rounded border border-[#ddd] bg-white px-2 py-1.5">
          <Search className="h-4 w-4 shrink-0 text-[#999]" />
          <span className="text-[12px] font-normal text-[#999]">Find a view</span>
        </div>
        <button className="rounded p-1 text-[#999] hover:bg-[#efefef] hover:text-[#555]">
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Views list */}
      <div className="flex-1 overflow-y-auto">
        {views.map((view) => {
          const isActive = view.id === activeViewId;
          return (
            <button
              key={view.id}
              onClick={() => handleSelectView(view.id)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors ${
                isActive
                  ? "bg-[#e3f2fd] text-[#1a73e8]"
                  : "text-[#444] hover:bg-[#f0f0f0]"
              }`}
            >
              <LayoutGrid className={`h-4 w-4 shrink-0 ${isActive ? "text-[#1a73e8]" : "text-[#888]"}`} />
              <span className="truncate text-[13px] font-normal">{view.name}</span>
            </button>
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
              className="w-full rounded border border-[#ddd] bg-white px-2.5 py-1.5 text-[12px] font-normal outline-none focus:border-[#1a73e8] focus:bg-white"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={createView.isPending}
                className="flex flex-1 items-center justify-center gap-1 rounded bg-[#1a73e8] py-1.5 text-[12px] font-medium text-white disabled:opacity-50"
              >
                {createView.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Create view"}
              </button>
              <button
                onClick={() => { setCreating(false); setNewName(""); }}
                className="rounded border border-[#ddd] bg-white px-3 py-1.5 text-[12px] font-normal text-[#666] hover:bg-[#f9f9f9]"
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