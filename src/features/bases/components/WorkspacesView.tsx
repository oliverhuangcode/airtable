// src/features/bases/components/WorkspacesView.tsx
"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, MoreHorizontal, ArrowRight, Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { AppShell } from "./AppShell";
import { getBaseColor, timeAgo, type BaseItem } from "./BasesView";

export function WorkspacesView() {
  const router = useRouter();
  const { data: bases, isLoading } = api.base.getAll.useQuery();

  return (
    <AppShell activePage="workspaces">
      <main className="flex-1 overflow-y-auto bg-[#f8f8f8] px-8 py-8">
        {/* Header row */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[26px] font-bold text-[#1f1f1f]">
            All Workspaces
          </h1>
          <button className="rounded-[6px] bg-[#1464e8] px-4 py-[9px] text-[13.5px] font-semibold text-white transition-colors hover:bg-[#1258cf]">
            Create a workspace
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-3">
          <button className="flex items-center gap-1 rounded px-2 py-1 text-[13px] text-[#555] transition-colors hover:bg-[#ebebeb]">
            Created time
            <ChevronDown className="h-3.5 w-3.5 text-[#888]" />
          </button>
          <button className="flex items-center gap-1 rounded px-2 py-1 text-[13px] text-[#555] transition-colors hover:bg-[#ebebeb]">
            All organizations and plans
            <ChevronDown className="h-3.5 w-3.5 text-[#888]" />
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#1464e8]" />
          </div>
        ) : (
          <WorkspaceCard
            name="My First Workspace"
            bases={(bases ?? []) as BaseItem[]}
            onOpenBase={(id) => router.push(`/base/${id}`)}
          />
        )}
      </main>
    </AppShell>
  );
}

function WorkspaceCard({
  name,
  bases,
  onOpenBase,
}: {
  name: string;
  bases: BaseItem[];
  onOpenBase: (id: string) => void;
}) {
  // Show at most 4 bases in the workspace card preview
  const preview = bases.slice(0, 4);

  return (
    <div className="rounded-xl border border-[#e3e3e3] bg-white p-6">
      {/* Workspace header */}
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-[18px] font-bold text-[#1f1f1f]">{name}</h2>
        <span className="rounded-full border border-[#e3e3e3] px-2.5 py-0.5 text-[12px] text-[#555]">
          Trial: 9 days left
        </span>
        <button className="ml-1 text-[#ccc] transition-colors hover:text-[#fcb400]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
        <div className="ml-auto flex items-center gap-1">
          <WorkspaceActionButton label="Create" />
          <WorkspaceActionButton label="Share" />
          <WorkspaceActionButton label="Settings" />
          <button className="flex h-7 w-7 items-center justify-center rounded border border-[#e3e3e3] text-[#666] transition-colors hover:bg-[#f5f5f5]">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Base cards grid */}
      {bases.length === 0 ? (
        <p className="py-4 text-[13px] text-[#aaa]">
          No bases in this workspace yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {preview.map((base) => (
            <WorkspaceBaseCard key={base.id} base={base} onOpen={onOpenBase} />
          ))}
        </div>
      )}

      {/* View workspace link */}
      <button className="mt-5 flex items-center gap-1.5 text-[13px] text-[#888] transition-colors hover:text-[#555]">
        View workspace
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function WorkspaceActionButton({ label }: { label: string }) {
  return (
    <button className="rounded border border-[#e3e3e3] px-3 py-1 text-[13px] text-[#444] transition-colors hover:bg-[#f5f5f5]">
      {label}
    </button>
  );
}

function WorkspaceBaseCard({
  base,
  onOpen,
}: {
  base: BaseItem;
  onOpen: (id: string) => void;
}) {
  const color = getBaseColor(base.name);
  const initials = base.name.slice(0, 2);

  return (
    <button
      onClick={() => onOpen(base.id)}
      className="flex items-center gap-3 rounded-xl border border-[#e3e3e3] bg-white p-4 text-left transition-all hover:border-[#c8c8c8] hover:shadow-sm"
    >
      <div
        className="flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center rounded-xl text-[15px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13.5px] font-semibold text-[#1f1f1f]">
          {base.name}
        </p>
        <p className="text-[12px] text-[#888]">
          {timeAgo(new Date(base.createdAt))}
        </p>
      </div>
    </button>
  );
}
