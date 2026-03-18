// src/features/bases/components/BasesView.tsx
"use client";

import { useState, useMemo } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  AlignJustify,
  Grid2X2,
  Loader2,
  Star,
} from "lucide-react";
import { AppShell } from "./AppShell";

// ─── Shared types & helpers (exported for other views) ───────────────────────

export type BaseItem = {
  id: string;
  name: string;
  createdAt: Date;
  tableCount: number;
};

const BASE_COLORS = [
  "#128064",
  "#2d7ff9",
  "#18bfff",
  "#20c933",
  "#fcb400",
  "#ff6f2c",
  "#f82b60",
  "#8b46ff",
];

export function getBaseColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BASE_COLORS[Math.abs(hash) % BASE_COLORS.length]!;
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Opened just now";
  if (diffMins < 60)
    return `Opened ${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `Opened ${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Opened yesterday";
  return `Opened ${diffDays} days ago`;
}

// ─── Shared card components (exported for other views) ────────────────────────

export function BaseCard({
  base,
  onOpen,
  extra,
}: {
  base: BaseItem;
  onOpen: (id: string) => void;
  extra?: React.ReactNode;
}) {
  const color = getBaseColor(base.name);
  const initials = base.name.slice(0, 2);

  return (
    <button
      onClick={() => onOpen(base.id)}
      className="relative flex items-center gap-3 rounded-lg border border-[#e3e3e3] bg-white p-4 text-left transition-all hover:border-[#c8c8c8] hover:shadow-sm"
    >
      <div
        className="flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center rounded-xl text-[15px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold text-[#1f1f1f]">
          {base.name}
        </p>
        <p className="text-[12px] text-[#888]">
          {timeAgo(new Date(base.createdAt))}
        </p>
      </div>
      {extra && <div className="absolute top-3 right-3">{extra}</div>}
    </button>
  );
}

export function BaseRow({
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
      className="flex items-center gap-3 border border-transparent bg-white px-4 py-3 text-left transition-all hover:bg-[#fafafa]"
    >
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[12px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <div>
        <p className="text-[13.5px] font-semibold text-[#1f1f1f]">
          {base.name}
        </p>
        <p className="text-[12px] text-[#888]">
          {timeAgo(new Date(base.createdAt))}
        </p>
      </div>
    </button>
  );
}

export function BaseGroup({
  title,
  bases,
  viewMode,
  onOpen,
}: {
  title: string;
  bases: BaseItem[];
  viewMode: "grid" | "list";
  onOpen: (id: string) => void;
}) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-[13px] font-medium text-[#888]">{title}</h3>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-3">
          {bases.map((base) => (
            <BaseCard key={base.id} base={base} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {bases.map((base) => (
            <BaseRow key={base.id} base={base} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Home page grouping ───────────────────────────────────────────────────────

function groupBases(bases: BaseItem[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  const today: BaseItem[] = [];
  const pastWeek: BaseItem[] = [];
  const older: BaseItem[] = [];

  for (const base of bases) {
    const d = new Date(base.createdAt);
    if (d >= todayStart) today.push(base);
    else if (d >= weekStart) pastWeek.push(base);
    else older.push(base);
  }
  return { today, pastWeek, older };
}

// ─── BasesView (Home page) ────────────────────────────────────────────────────

export function BasesView() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [newBaseName, setNewBaseName] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: bases, isLoading } = api.base.getAll.useQuery();
  const utils = api.useUtils();

  const createBase = api.base.create.useMutation({
    onSuccess: (newBase) => {
      void utils.base.getAll.invalidate();
      setNewBaseName("");
      setIsCreating(false);
      router.push(`/base/${newBase.id}`);
    },
  });

  const grouped = useMemo(() => {
    if (!bases) return { today: [], pastWeek: [], older: [] };
    return groupBases(bases as BaseItem[]);
  }, [bases]);

  const handleCreate = () => {
    if (!newBaseName.trim()) return;
    createBase.mutate({ name: newBaseName.trim() });
  };

  return (
    <AppShell activePage="home">
      <main className="flex-1 overflow-y-auto bg-[#f8f8f8] px-8 py-8">
        <h1 className="mb-6 text-[26px] font-bold text-[#1f1f1f]">Home</h1>

        {/* Action cards */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          <ActionCard
            icon={<OmniIcon />}
            title="Start with Omni"
            description="Use AI to build a custom app tailored to your workflow"
          />
          <ActionCard
            icon={<TemplatesIcon />}
            title="Start with templates"
            description="Select a template to get started and customize as you go."
          />
          <ActionCard
            icon={<QuickUploadIcon />}
            title="Quickly upload"
            description="Easily migrate your existing projects in just a few minutes."
          />
          <ActionCard
            icon={<BuildAppIcon />}
            title="Build an app on your own"
            description="Start with a blank app and build your ideal workflow."
            onClick={() => setIsCreating(true)}
          />
        </div>

        {/* Inline create form */}
        {isCreating && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-[#1464e8] bg-white p-4 shadow-sm">
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
              className="flex-1 text-sm text-[#1f1f1f] outline-none placeholder:text-[#aaa]"
            />
            <button
              onClick={handleCreate}
              disabled={createBase.isPending || !newBaseName.trim()}
              className="rounded bg-[#1464e8] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1258cf] disabled:opacity-50"
            >
              {createBase.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create"
              )}
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="rounded px-3 py-1.5 text-sm text-[#666] transition-colors hover:bg-[#f0f0f0]"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Filter + view toggle */}
        <div className="mb-4 flex items-center justify-between">
          <button className="flex items-center gap-1 rounded px-2 py-1 text-[13px] text-[#555] transition-colors hover:bg-[#ebebeb]">
            Opened anytime
            <ChevronDown className="h-3.5 w-3.5 text-[#888]" />
          </button>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                viewMode === "list" ? "bg-[#ebebeb]" : "hover:bg-[#ebebeb]"
              }`}
            >
              <AlignJustify className="h-[15px] w-[15px] text-[#555]" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                viewMode === "grid" ? "bg-[#ebebeb]" : "hover:bg-[#ebebeb]"
              }`}
            >
              <Grid2X2 className="h-[15px] w-[15px] text-[#555]" />
            </button>
          </div>
        </div>

        {/* Bases list */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#1464e8]" />
          </div>
        ) : !bases || bases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-[#aaa]">
              No bases yet. Click Create to get started.
            </p>
          </div>
        ) : (
          <>
            {grouped.today.length > 0 && (
              <BaseGroup
                title="Today"
                bases={grouped.today}
                viewMode={viewMode}
                onOpen={(id) => router.push(`/base/${id}`)}
              />
            )}
            {grouped.pastWeek.length > 0 && (
              <BaseGroup
                title="Past 7 days"
                bases={grouped.pastWeek}
                viewMode={viewMode}
                onOpen={(id) => router.push(`/base/${id}`)}
              />
            )}
            {grouped.older.length > 0 && (
              <BaseGroup
                title="Older"
                bases={grouped.older}
                viewMode={viewMode}
                onOpen={(id) => router.push(`/base/${id}`)}
              />
            )}
          </>
        )}
      </main>
    </AppShell>
  );
}

// ─── Action card components ───────────────────────────────────────────────────

function ActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer flex-col items-start rounded-lg border border-[#e3e3e3] bg-white p-5 text-left transition-all hover:border-[#c8c8c8] hover:shadow-sm"
    >
      <div className="mb-3 flex items-center gap-2.5">
        {icon}
        <span className="text-[13.5px] font-semibold text-[#1f1f1f]">
          {title}
        </span>
      </div>
      <p className="text-[13px] leading-[1.45] text-[#888]">{description}</p>
    </button>
  );
}

function OmniIcon() {
  return (
    <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#f3e8ff]">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="#9333ea">
        <path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z" />
      </svg>
    </div>
  );
}

function TemplatesIcon() {
  return (
    <div className="flex h-[22px] w-[22px] items-center justify-center rounded bg-[#dbeafe]">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="#2563eb">
        <path
          fillRule="evenodd"
          d="M2.5 2C1.67157 2 1 2.67157 1 3.5V12.5C1 13.3284 1.67157 14 2.5 14H13.5C14.3284 14 15 13.3284 15 12.5V3.5C15 2.67157 14.3284 2 13.5 2H2.5ZM2 3.5C2 3.22386 2.22386 3 2.5 3H13.5C13.7761 3 14 3.22386 14 3.5V5H2V3.5ZM8.5 6H14V9H8.5V6ZM7.5 9V6H2V9H7.5ZM2 10V12.5C2 12.7761 2.22386 13 2.5 13H7.5V10H2ZM8.5 10H14V12.5C14 12.7761 13.7761 13 13.5 13H8.5V10Z"
        />
      </svg>
    </div>
  );
}

function QuickUploadIcon() {
  return (
    <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#e0f5f5]">
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0d7a6e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </div>
  );
}

// BuildAppIcon uses the same grid layout as TemplatesIcon
const BuildAppIcon = TemplatesIcon;

// Keep Star import accessible for starred page
export { Star };
