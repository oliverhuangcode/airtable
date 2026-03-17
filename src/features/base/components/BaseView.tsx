// src/features/base/components/BaseView.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { TableGrid } from "./TableGrid";
import { TableTabs } from "./TableTabs";
import { Toolbar } from "./Toolbar";
import { ViewSidebar } from "./ViewSidebar";
import {
  Loader2, AlertCircle, ChevronDown, ChevronRight, Clock, ExternalLink, Link2, HelpCircle, Bell,
  Undo2, Redo2, Trash2, List, Star, MoreHorizontal, X,
} from "lucide-react";
import type { Filter, Sort, FieldSummary } from "~/types";

interface Props {
  baseId: string;
}

function parseJSON<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str) as T; }
  catch { return fallback; }
}

// Airtable logo icon
function AirtableLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.286 1.6a1.5 1.5 0 0 1 1.428 0l6.5 3.5a1.5 1.5 0 0 1 .786 1.32v7.16a1.5 1.5 0 0 1-.786 1.32l-6.5 3.5a1.5 1.5 0 0 1-1.428 0l-6.5-3.5A1.5 1.5 0 0 1 2 12.58V5.42a1.5 1.5 0 0 1 .786-1.32l6.5-3.5z" fill="#FCB400"/>
    </svg>
  );
}

// Airtable home icon (the small arrow/chevron icon in sidebar)
function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#666]">
      <path d="M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

/* ─── History Panel ──────────────────────────────────── */
function HistoryPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute right-0 top-full z-50 mt-1 w-[260px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="px-4 py-2.5 text-[14px] font-semibold text-[#1d1f25]">History</div>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Undo2 className="h-[18px] w-[18px] text-[#666]" />
          <span className="flex-1">Undo</span>
          <span className="text-[12px] text-[#999]">&#8984;Z</span>
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Redo2 className="h-[18px] w-[18px] text-[#666]" />
          <span className="flex-1">Redo</span>
          <span className="text-[12px] text-[#999]">&#8984;&#8679;Z</span>
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Clock className="h-[18px] w-[18px] text-[#666]" />
          <span className="flex-1">Snapshots</span>
          <ChevronRight className="h-4 w-4 text-[#999]" />
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <List className="h-[18px] w-[18px] text-[#666]" />
          <span className="flex-1">Record revision history</span>
          <ChevronRight className="h-4 w-4 text-[#999]" />
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Trash2 className="h-[18px] w-[18px] text-[#666]" />
          Trash
        </button>
      </div>
    </>
  );
}

/* ─── Invite Link Popup ──────────────────────────────── */
function InviteLinkPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute right-0 top-full z-50 mt-1 w-[360px] rounded-lg border border-[#e0e0e0] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-[#1d1f25]">Invite link</span>
          <button onClick={onClose} className="rounded p-1 text-[#999] hover:bg-[#f0f0f0] hover:text-[#555]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-3 flex items-center gap-2 rounded-md border border-[#ddd] bg-[#f9f9f9] px-3 py-2">
          <span className="flex-1 truncate text-[13px] text-[#666]">
            https://airtable.com/invite/l?invit...
          </span>
        </div>
        <button className="mb-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#1d1f25] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#333]">
          <Link2 className="h-4 w-4" />
          Copy link
        </button>
        <p className="text-[12px] text-[#888]">
          Editor &#8744; access for anyone with this link.{" "}
          <button className="font-medium text-[#2d7ff9] hover:underline">Manage</button>
        </p>
      </div>
    </>
  );
}

/* ─── Base Info Panel ────────────────────────────────── */
function BaseInfoPanel({ baseName, onClose }: { baseName: string; onClose: () => void }) {
  const [guideOpen, setGuideOpen] = useState(true);

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute left-0 top-full z-50 mt-1 w-[320px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2.5">
          <span className="flex-1 text-[15px] font-semibold text-[#1d1f25]">{baseName}</span>
          <button className="rounded p-1 text-[#999] hover:bg-[#f0f0f0]">
            <Star className="h-4 w-4" />
          </button>
          <button className="rounded p-1 text-[#999] hover:bg-[#f0f0f0]">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="mx-3 border-t border-[#e8e8e8]" />

        {/* Appearance - collapsed */}
        <button className="flex w-full items-center gap-2 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <ChevronRight className="h-4 w-4 text-[#999]" />
          Appearance
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />

        {/* Base guide - expanded */}
        <button
          onClick={() => setGuideOpen((v) => !v)}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]"
        >
          {guideOpen ? (
            <ChevronDown className="h-4 w-4 text-[#999]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[#999]" />
          )}
          Base guide
        </button>
        {guideOpen && (
          <div className="px-4 pb-3 text-[13px] leading-relaxed text-[#666]">
            Welcome to this base! Use the tables and views to organize your data. Click on any cell to edit, add new records with the + button, and explore different views in the sidebar.
          </div>
        )}
      </div>
    </>
  );
}

export function BaseView({ baseId }: Props) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  // ── URL-driven state ──────────────────────────────────────────────────────
  const activeTableId = searchParams.get("tableId");
  const activeViewId  = searchParams.get("viewId");
  const search        = searchParams.get("search") ?? "";
  const filters       = useMemo<Filter[]>(
    () => parseJSON(searchParams.get("filters"), []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.get("filters")],
  );
  const sorts = useMemo<Sort[]>(
    () => parseJSON(searchParams.get("sorts"), []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.get("sorts")],
  );

  const [hiddenFieldIds, setHiddenFieldIds] = useState<string[]>([]);
  const [searchIndex, setSearchIndex] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Popup state
  const [showHistory, setShowHistory]         = useState(false);
  const [showInviteLink, setShowInviteLink]   = useState(false);
  const [showBaseInfo, setShowBaseInfo]        = useState(false);

  const pathnameRef = useRef(pathname);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  const updateParams = useCallback((patch: Record<string, string | null>) => {
    setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "" || value === "[]") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(`${pathnameRef.current}${qs ? `?${qs}` : ""}`);
    }, 0);
  }, [router]);

  // ── READ ──────────────────────────────────────────────────────────────────
  const { data: base, isLoading, error } = api.base.getById.useQuery({ id: baseId });

  const didAutoSelect = useRef(false);
  useEffect(() => {
    if (!didAutoSelect.current && !activeTableId && base?.tables[0]) {
      didAutoSelect.current = true;
      updateParams({ tableId: base.tables[0].id });
    }
  }, [base?.tables, activeTableId, updateParams]);

  useEffect(() => {
    setHiddenFieldIds([]);
  }, [activeTableId]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeTable = base?.tables.find((t) => t.id === activeTableId);
  const visibleFields: FieldSummary[] = useMemo(
    () => (activeTable?.fields ?? []).filter((f) => !hiddenFieldIds.includes(f.id)),
    [activeTable?.fields, hiddenFieldIds],
  );

  // Record count — derived from listAll (which TableGrid also uses, so React Query deduplicates)
  const { data: listAllData, isFetching: isCountFetching } = api.record.listAll.useQuery(
    { tableId: activeTableId!, filters, sorts, search },
    { staleTime: 60_000, enabled: !!activeTableId },
  );
  const countData = listAllData ? { total: listAllData.total } : undefined;

  // ── View select — loads saved filters/sorts/hidden into URL + state ───────
  const handleSelectView = useCallback(({
    viewId, filters, sorts, hiddenFieldIds,
  }: {
    viewId:         string;
    filters:        Filter[];
    sorts:          Sort[];
    hiddenFieldIds: string[];
  }) => {
    setHiddenFieldIds(hiddenFieldIds);
    updateParams({
      viewId:  viewId,
      filters: filters.length  ? JSON.stringify(filters) : null,
      sorts:   sorts.length    ? JSON.stringify(sorts)   : null,
      search:  null,
    });
  }, [updateParams]);

  // ── LOADING / ERROR ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-5 w-5 animate-spin text-[#2d7ff9]" />
      </div>
    );
  }

  if (error || !base) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">Failed to load base</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left icon rail */}
      <div className="flex w-[56px] px-2 py-4 shrink-0 flex-col items-center justify-between border-r border-black/10 bg-white py-2">
        {/* Top icons */}
        <div className="flex flex-col items-center gap-1">
          <button className="flex items-center justify-center rounded p-1.5 hover:bg-[#f0f0f0]">
            <HomeIcon />
          </button>
          <button className="flex items-center justify-center rounded p-1.5 hover:bg-[#f0f0f0]">
            <AirtableLogo />
          </button>
        </div>
        {/* Bottom: help, notifications, avatar */}
        <div className="flex flex-col items-center gap-2">
          <button className="rounded p-1.5 text-[#888] hover:bg-[#f0f0f0] hover:text-[#555]">
            <HelpCircle className="h-[18px] w-[18px]" />
          </button>
          <button className="rounded p-1.5 text-[#888] hover:bg-[#f0f0f0] hover:text-[#555]">
            <Bell className="h-[18px] w-[18px]" />
          </button>
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#f59e0b] text-[11px] font-semibold text-white">
            O
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top nav */}
        <div className="relative flex h-[56px] shrink-0 items-center justify-between border-b border-black/10 bg-white px-3">
          <div className="flex items-center gap-2">
            {/* Base color icon */}
            <div className="flex h-5 w-5 items-center justify-center rounded" style={{ backgroundColor: "#18BFFF" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="white">
                <rect x="2" y="2" width="5" height="5" rx="0.5" />
                <rect x="9" y="2" width="5" height="5" rx="0.5" />
                <rect x="2" y="9" width="5" height="5" rx="0.5" />
                <rect x="9" y="9" width="5" height="5" rx="0.5" />
              </svg>
            </div>
            {/* Base name — with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBaseInfo((v) => !v)}
                className="flex items-center gap-1 rounded px-1 py-0.5 hover:bg-[#f0f0f0]"
              >
                <span className="text-[15px] font-semibold text-[#1d1f25]">{base.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#1d1f25]/50" />
              </button>
              {showBaseInfo && (
                <BaseInfoPanel baseName={base.name} onClose={() => setShowBaseInfo(false)} />
              )}
            </div>
          </div>

          {/* Center nav links — absolutely centered across full nav width */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="pointer-events-auto flex items-center gap-1">
              {["Data", "Automations", "Interfaces", "Forms"].map((label) => (
                <button
                  key={label}
                  className={`px-2 py-4 text-[13px] font-medium transition-colors ${
                    label === "Data"
                      ? "text-[#1d1f25] underline decoration-[#1d1f25] decoration-2 underline-offset-[18px]"
                      : "text-black/65 hover:text-[#1d1f25]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1.5">
            {/* History */}
            <div className="relative">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className={`rounded-md p-1.5 transition-colors ${
                  showHistory ? "bg-[#d0e5ff] text-[#2d7ff9]" : "text-[#1d1f25] hover:bg-black/5"
                }`}
              >
                <Clock className="h-4 w-4" />
              </button>
              {showHistory && (
                <HistoryPanel onClose={() => setShowHistory(false)} />
              )}
            </div>

            <button className="flex items-center gap-1.5 rounded-[6px] bg-white px-2 py-1 text-[13px] font-normal text-[#1d1f25] shadow-[0_0_0_1px_rgba(0,0,0,0.1)] hover:bg-black/5">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              Reaching plan limits
            </button>
            <button className="flex items-center gap-1.5 rounded-[6px] bg-white px-2 py-1 text-[13px] font-normal text-[#1d1f25] shadow-[0_0_0_1px_rgba(0,0,0,0.1)] hover:bg-black/5">
              <ExternalLink className="h-3.5 w-3.5" />
              Launch
            </button>

            {/* Invite link */}
            <div className="relative">
              <button
                onClick={() => setShowInviteLink((v) => !v)}
                className={`rounded-md p-1.5 transition-colors ${
                  showInviteLink ? "bg-[#d0e5ff] text-[#2d7ff9]" : "text-[#1d1f25] hover:bg-black/5"
                }`}
              >
                <Link2 className="h-4 w-4" />
              </button>
              {showInviteLink && (
                <InviteLinkPopup onClose={() => setShowInviteLink(false)} />
              )}
            </div>

            <button className="rounded-[6px] bg-[#2d7ff9] px-3 py-1 text-[13px] font-medium text-white hover:bg-[#1a6ed8]">
              Share
            </button>
          </div>
        </div>

        {/* Table tabs */}
        <TableTabs
          baseId={baseId}
          tables={base.tables}
          activeTableId={activeTableId}
          onSelectTable={(id) => {
            updateParams({ tableId: id, viewId: null, search: null, filters: null, sorts: null });
          }}
        />

        {/* Toolbar — spans full width */}
        {activeTableId && activeTable && (
          <Toolbar
            tableId={activeTableId}
            fields={activeTable.fields}
            search={search}
            filters={filters}
            sorts={sorts}
            hiddenFieldIds={hiddenFieldIds}
            matchCount={search ? countData?.total : undefined}
            isSearching={!!search && isCountFetching}
            searchIndex={searchIndex}
            onSearchIndexChange={setSearchIndex}
            onSearchChange={(v) => { updateParams({ search: v }); setSearchIndex(1); }}
            onFiltersChange={(v) => updateParams({ filters: JSON.stringify(v) })}
            onSortsChange={(v) => updateParams({ sorts: JSON.stringify(v) })}
            onHiddenFieldsChange={setHiddenFieldIds}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
          />
        )}

        {/* Sidebar + Grid row */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar — views list */}
          {activeTableId && (
            <div
              className="shrink-0 overflow-hidden border-r border-black/10 transition-[width] duration-300 ease-in-out"
              style={{ width: sidebarOpen ? 280 : 0, borderRightWidth: sidebarOpen ? 1 : 0 }}
            >
              <div className="h-full w-[280px]">
                <ViewSidebar
                  tableId={activeTableId}
                  activeViewId={activeViewId}
                  search={search}
                  filters={filters}
                  sorts={sorts}
                  hiddenFieldIds={hiddenFieldIds}
                  onSelectView={handleSelectView}
                  onViewIdChange={(id: string) => updateParams({ viewId: id })}
                />
              </div>
            </div>
          )}

          {/* Grid */}
          {activeTableId && activeTable && (
            <div className="flex-1 overflow-hidden">
              <TableGrid
                tableId={activeTableId}
                fields={visibleFields}
                allFields={activeTable.fields}
                search={search}
                filters={filters}
                sorts={sorts}
                searchIndex={searchIndex}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
