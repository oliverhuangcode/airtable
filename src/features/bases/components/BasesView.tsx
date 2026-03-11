// src/features/bases/components/BasesView.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Plus, Grid3X3, Loader2, AlertCircle } from "lucide-react";

export function BasesView() {
  const router = useRouter();
  const [newBaseName, setNewBaseName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // ── READ: load all bases ──────────────────────────────────────────────────
  const { data: bases, isLoading, error } = api.base.getAll.useQuery();
  const utils = api.useUtils();

  // ── WRITE: create base ────────────────────────────────────────────────────
  const createBase = api.base.create.useMutation({
    onSuccess: (newBase) => {
      // invalidate so the list refetches with the new base
      void utils.base.getAll.invalidate();
      setNewBaseName("");
      setIsCreating(false);
      router.push(`/base/${newBase.id}`);
    },
  });

  const handleCreate = () => {
    if (!newBaseName.trim()) return;
    createBase.mutate({ name: newBaseName.trim() });
  };

  // ── STATES ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f8f8]">
        <Loader2 className="h-6 w-6 animate-spin text-[#1170cb]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f8f8]">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">Failed to load bases</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Header */}
      <div className="border-b border-[#e0e0e0] bg-white px-8 py-4">
        <h1 className="text-xl font-semibold text-[#1f1f1f]">Home</h1>
      </div>

      <div className="mx-auto max-w-5xl px-8 py-8">
        {/* Section title */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#666]">My bases</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 rounded bg-[#1170cb] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0e5fad] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Create base
          </button>
        </div>

        {/* Create form */}
        {isCreating && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#1170cb] bg-white p-4 shadow-sm">
            <input
              autoFocus
              type="text"
              value={newBaseName}
              onChange={(e) => setNewBaseName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setIsCreating(false);
              }}
              placeholder="Base name..."
              className="flex-1 text-sm outline-none text-[#1f1f1f] placeholder:text-[#999]"
            />
            <button
              onClick={handleCreate}
              disabled={createBase.isPending || !newBaseName.trim()}
              className="rounded bg-[#1170cb] px-3 py-1 text-sm font-medium text-white disabled:opacity-50 hover:bg-[#0e5fad] transition-colors"
            >
              {createBase.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create"
              )}
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="rounded px-3 py-1 text-sm text-[#666] hover:bg-[#f0f0f0] transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Empty state */}
        {bases?.length === 0 && !isCreating && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#ccc] bg-white py-16">
            <Grid3X3 className="mb-3 h-8 w-8 text-[#ccc]" />
            <p className="text-sm font-medium text-[#666]">No bases yet</p>
            <p className="mt-1 text-xs text-[#999]">Create a base to get started</p>
          </div>
        )}

        {/* Bases grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bases?.map((base) => (
            <button
              key={base.id}
              onClick={() => router.push(`/base/${base.id}`)}
              className="group flex items-center gap-3 rounded-lg border border-[#e0e0e0] bg-white p-4 text-left shadow-sm hover:border-[#1170cb] hover:shadow-md transition-all"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#1170cb] text-white">
                <Grid3X3 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#1f1f1f] group-hover:text-[#1170cb]">
                  {base.name}
                </p>
                <p className="text-xs text-[#999]">
                  {base.tableCount} {base.tableCount === 1 ? "table" : "tables"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
