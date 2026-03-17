// src/features/base/components/BaseView.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { TableGrid } from "./TableGrid";
import { TableTabs } from "./TableTabs";
import { Toolbar } from "./Toolbar";
import { ViewSidebar } from "./ViewSidebar";
import { Loader2, AlertCircle, ChevronRight, Star, MoreHorizontal, X, Trash2 } from "lucide-react";
import {
  ChevronDownIcon, ClockCounterClockwiseIcon, ArrowSquareOutIcon, LinkIcon,
  QuestionIcon, BellIcon, ListIcon, ArrowUUpLeftIcon,
} from "~/components/icons/AirtableIcons";
import type { Filter, Sort, FieldSummary } from "~/types";

interface Props {
  baseId: string;
}

function parseJSON<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str) as T; }
  catch { return fallback; }
}

// Exact Airtable 3D logo icon
function AirtableHomeIcon() {
  return (
    <svg width="24" height="20.4" viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'geometricPrecision' }}>
      <g>
        <path fill="currentColor" d="M90.0389,12.3675 L24.0799,39.6605 C20.4119,41.1785 20.4499,46.3885 24.1409,47.8515 L90.3759,74.1175 C96.1959,76.4255 102.6769,76.4255 108.4959,74.1175 L174.7319,47.8515 C178.4219,46.3885 178.4609,41.1785 174.7919,39.6605 L108.8339,12.3675 C102.8159,9.8775 96.0559,9.8775 90.0389,12.3675" />
        <path fill="currentColor" d="M105.3122,88.4608 L105.3122,154.0768 C105.3122,157.1978 108.4592,159.3348 111.3602,158.1848 L185.1662,129.5368 C186.8512,128.8688 187.9562,127.2408 187.9562,125.4288 L187.9562,59.8128 C187.9562,56.6918 184.8092,54.5548 181.9082,55.7048 L108.1022,84.3528 C106.4182,85.0208 105.3122,86.6488 105.3122,88.4608" />
        <path fill="currentColor" d="M88.0781,91.8464 L66.1741,102.4224 L63.9501,103.4974 L17.7121,125.6524 C14.7811,127.0664 11.0401,124.9304 11.0401,121.6744 L11.0401,60.0884 C11.0401,58.9104 11.6441,57.8934 12.4541,57.1274 C12.7921,56.7884 13.1751,56.5094 13.5731,56.2884 C14.6781,55.6254 16.2541,55.4484 17.5941,55.9784 L87.7101,83.7594 C91.2741,85.1734 91.5541,90.1674 88.0781,91.8464" />
      </g>
    </svg>
  );
}

// Exact Airtable "Omni" ring icon — static state
// In static: inner ring bits scale=0 (hidden), middle ring rotated 16.36° bits opacity 0.4 translated 16px,
// outer ring rotated 32.73° bits opacity 1, eyes scale(1,0) (hidden)
function AirtableRingIcon() {
  const bitPath = "M0 7.68C0 4.99175 2.38419e-07 3.64762 0.523169 2.62085C0.983361 1.71767 1.71767 0.983361 2.62085 0.523169C3.64762 0 4.99175 0 7.68 0H8.32C11.0083 0 12.3524 0 13.3792 0.523169C14.2823 0.983361 15.0166 1.71767 15.4768 2.62085C16 3.64762 16 4.99175 16 7.68V8.32C16 11.0083 16 12.3524 15.4768 13.3792C15.0166 14.2823 14.2823 15.0166 13.3792 15.4768C12.3524 16 11.0083 16 8.32 16H7.68C4.99175 16 3.64762 16 2.62085 15.4768C1.71767 15.0166 0.983361 14.2823 0.523169 13.3792C2.38419e-07 12.3524 0 11.0083 0 8.32V7.68Z";
  const angles = [0, 32.72727272727273, 65.45454545454545, 98.18181818181819, 130.9090909090909, 163.63636363636363, 196.36363636363637, 229.0909090909091, 261.8181818181818, 294.54545454545456, 327.27272727272725];

  return (
    <div className="flex h-7 w-7 items-center justify-center" style={{ backgroundColor: 'transparent' }}>
      <svg height="36" width="36" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style={{ color: '#1d1f25' }}>
        <g transform="scale(0.9090909090909091)" style={{ transformOrigin: 'center center' }}>
          {/* Middle ring: rotate 16.36°, bits opacity 0.4, translate 0 16px */}
          <g style={{ transformOrigin: 'center center', rotate: '16.3636deg' }}>
            {angles.map((angle) => (
              <g key={`m${angle}`} style={{ transformOrigin: 'center center' }} transform={`rotate(${angle})`}>
                <g transform="translate(72, 0)">
                  <path d={bitPath} fill="currentColor" opacity={0.4} style={{ transformOrigin: '8px 8px', translate: '0px 16px' }} />
                </g>
              </g>
            ))}
          </g>
          {/* Outer ring: rotate 32.73°, bits opacity 1 */}
          <g style={{ transformOrigin: 'center center', rotate: '32.7273deg' }}>
            {angles.map((angle) => (
              <g key={`o${angle}`} style={{ transformOrigin: 'center center' }} transform={`rotate(${angle})`}>
                <g transform="translate(72, 0)">
                  <path d={bitPath} fill="currentColor" opacity={1} style={{ transformOrigin: '8px 8px' }} />
                </g>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
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
          <ArrowUUpLeftIcon size={16} className="text-[#666]" />
          <span className="flex-1">Undo</span>
          <span className="text-[12px] text-[#999]">&#8984;Z</span>
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <ArrowUUpLeftIcon size={16} className="text-[#666]" style={{ transform: 'scaleX(-1)' }} />
          <span className="flex-1">Redo</span>
          <span className="text-[12px] text-[#999]">&#8984;&#8679;Z</span>
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <ClockCounterClockwiseIcon size={16} className="text-[#666]" />
          <span className="flex-1">Snapshots</span>
          <ChevronRight className="h-4 w-4 text-[#999]" />
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <ListIcon size={16} className="text-[#666]" />
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
          <LinkIcon size={16} />
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
            <ChevronDownIcon size={16} className="text-[#999]" />
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
        <div className="flex flex-col items-center gap-2">
          <button className="flex items-center justify-center rounded p-1.5 text-[#1d1f25] hover:bg-[#f0f0f0]">
            <AirtableHomeIcon />
          </button>
          <button className="flex items-center justify-center rounded p-1.5 hover:bg-[#f0f0f0]">
            <AirtableRingIcon />
          </button>
        </div>
        {/* Bottom: help, notifications, avatar */}
        <div className="flex flex-col items-center gap-2">
          <button className="rounded p-1.5 text-[#888] hover:bg-[#f0f0f0] hover:text-[#555]">
            <QuestionIcon size={16} />
          </button>
          <button className="rounded p-1.5 text-[#888] hover:bg-[#f0f0f0] hover:text-[#555]">
            <BellIcon size={16} />
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
            {/* Base color icon — Airtable 3D logo on colored background */}
            <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10" style={{ width: 32, height: 32, backgroundColor: "#117da2" }}>
              <svg width="24" height="20.4" viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'geometricPrecision' }}>
                  <g>
                    <path fill="hsla(0, 0%, 100%, 0.95)" d="M90.0389,12.3675 L24.0799,39.6605 C20.4119,41.1785 20.4499,46.3885 24.1409,47.8515 L90.3759,74.1175 C96.1959,76.4255 102.6769,76.4255 108.4959,74.1175 L174.7319,47.8515 C178.4219,46.3885 178.4609,41.1785 174.7919,39.6605 L108.8339,12.3675 C102.8159,9.8775 96.0559,9.8775 90.0389,12.3675" />
                    <path fill="hsla(0, 0%, 100%, 0.95)" d="M105.3122,88.4608 L105.3122,154.0768 C105.3122,157.1978 108.4592,159.3348 111.3602,158.1848 L185.1662,129.5368 C186.8512,128.8688 187.9562,127.2408 187.9562,125.4288 L187.9562,59.8128 C187.9562,56.6918 184.8092,54.5548 181.9082,55.7048 L108.1022,84.3528 C106.4182,85.0208 105.3122,86.6488 105.3122,88.4608" />
                    <path fill="hsla(0, 0%, 100%, 0.95)" d="M88.0781,91.8464 L66.1741,102.4224 L63.9501,103.4974 L17.7121,125.6524 C14.7811,127.0664 11.0401,124.9304 11.0401,121.6744 L11.0401,60.0884 C11.0401,58.9104 11.6441,57.8934 12.4541,57.1274 C12.7921,56.7884 13.1751,56.5094 13.5731,56.2884 C14.6781,55.6254 16.2541,55.4484 17.5941,55.9784 L87.7101,83.7594 C91.2741,85.1734 91.5541,90.1674 88.0781,91.8464" />
                  </g>
                </svg>
            </div>
            {/* Base name — with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBaseInfo((v) => !v)}
                className="flex items-center gap-1 rounded px-1 py-0.5 hover:bg-[#f0f0f0]"
              >
                <span className="text-[15px] font-semibold text-[#1d1f25]">{base.name}</span>
                <ChevronDownIcon size={14} className="text-[#1d1f25]/50" />
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
                <ClockCounterClockwiseIcon size={16} />
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
              <ArrowSquareOutIcon size={14} />
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
                <LinkIcon size={16} />
              </button>
              {showInviteLink && (
                <InviteLinkPopup onClose={() => setShowInviteLink(false)} />
              )}
            </div>

            <button className="rounded-[6px] bg-[#117da2] px-3 py-1 text-[13px] font-medium text-white hover:bg-[#0e6a8a]">
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
                onHideField={(fieldId) => {
                  setHiddenFieldIds((prev) => prev.includes(fieldId) ? prev : [...prev, fieldId]);
                }}
                onFilterByField={(fieldId) => {
                  const field = activeTable.fields.find((f) => f.id === fieldId);
                  if (!field) return;
                  const newFilter: Filter = field.type === "NUMBER"
                    ? { type: "number", fieldId, op: "equals", value: 0 }
                    : { type: "text", fieldId, op: "equals", value: "" };
                  const next = [...filters, newFilter];
                  updateParams({ filters: JSON.stringify(next) });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
