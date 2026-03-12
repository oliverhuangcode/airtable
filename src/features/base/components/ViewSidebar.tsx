// src/features/base/components/ViewSidebar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { Grid2x2, Plus, Loader2 } from "lucide-react";
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
    <div className="flex h-full w-[220px] flex-shrink-0 flex-col border-r border-[#e0e0e0] bg-[#fafafa]">
      {/* Header */}
      <div className="px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">Views</span>
      </div>

      {/* View list */}
      <div className="flex-1 overflow-y-auto">
        {views.map((view) => {
          const isActive = view.id === activeViewId;
          return (
            <div
              key={view.id}
              onClick={() => { if (!isActive) void handleSelectView(view.id); }}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors ${
                isActive
                  ? "bg-[#e8f0fe] text-[#1170cb]"
                  : "text-[#333] hover:bg-[#f0f0f0]"
              }`}
            >
              <Grid2x2 className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="flex-1 truncate font-medium">{view.name}</span>
              {isActive && updateConfig.isPending && (
                <Loader2 className="h-3 w-3 animate-spin text-[#1170cb]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Create new view */}
      <div className="border-t border-[#e0e0e0] p-2">
        {creating ? (
          <div className="flex flex-col gap-1.5">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")  handleCreate();
                if (e.key === "Escape") { setCreating(false); setNewName(""); }
              }}
              placeholder="View name"
              className="w-full rounded border border-[#1170cb] px-2 py-1 text-xs outline-none"
            />
            <div className="flex gap-1">
              <button
                onClick={handleCreate}
                disabled={createView.isPending}
                className="flex flex-1 items-center justify-center gap-1 rounded bg-[#1170cb] py-1 text-[10px] text-white"
              >
                {createView.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Create view"}
              </button>
              <button
                onClick={() => { setCreating(false); setNewName(""); }}
                className="rounded border border-[#e0e0e0] px-2 py-1 text-[10px] text-[#666] hover:bg-[#f0f0f0]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-[#666] hover:bg-[#f0f0f0] hover:text-[#1170cb]"
          >
            <Plus className="h-3.5 w-3.5" />
            Create new view
          </button>
        )}
      </div>
    </div>
  );
}