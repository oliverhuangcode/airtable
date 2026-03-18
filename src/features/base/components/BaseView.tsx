"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { TableGrid } from "./TableGrid";
import { TableTabs } from "./TableTabs";
import { Toolbar } from "./Toolbar";
import { ViewSidebar } from "./ViewSidebar";
import {
  Loader2,
  AlertCircle,
  ChevronRight,
  Star,
  MoreHorizontal,
  X,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import {
  ChevronDownIcon,
  ClockCounterClockwiseIcon,
  ArrowSquareOutIcon,
  LinkIcon,
  QuestionIcon,
  BellIcon,
  ListIcon,
  ArrowUUpLeftIcon,
  AirtableLogoIcon,
  AirtableRingIcon,
} from "~/components/icons/AirtableIcons";
import { SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH } from "~/lib/constants";
import type { Filter, Sort, FieldSummary } from "~/types";

interface Props {
  baseId: string;
}

function parseJSON<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

function HistoryPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[260px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="px-4 py-2.5 text-[14px] font-semibold text-[#1d1f25]">
          History
        </div>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <ArrowUUpLeftIcon size={16} className="text-[#666]" />
          <span className="flex-1">Undo</span>
          <span className="text-[12px] text-[#999]">&#8984;Z</span>
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <ArrowUUpLeftIcon
            size={16}
            className="text-[#666]"
            style={{ transform: "scaleX(-1)" }}
          />
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

function InviteLinkPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[360px] rounded-lg border border-[#e0e0e0] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-[#1d1f25]">
            Invite link
          </span>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#999] hover:bg-[#f0f0f0] hover:text-[#555]"
          >
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
          <button className="font-medium text-[#2d7ff9] hover:underline">
            Manage
          </button>
        </p>
      </div>
    </>
  );
}

function BaseInfoPanel({
  baseName,
  onClose,
}: {
  baseName: string;
  onClose: () => void;
}) {
  const [guideOpen, setGuideOpen] = useState(true);

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full left-0 z-50 mt-1 w-[320px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <span className="flex-1 text-[15px] font-semibold text-[#1d1f25]">
            {baseName}
          </span>
          <button className="rounded p-1 text-[#999] hover:bg-[#f0f0f0]">
            <Star className="h-4 w-4" />
          </button>
          <button className="rounded p-1 text-[#999] hover:bg-[#f0f0f0]">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="mx-3 border-t border-[#e8e8e8]" />

        <button className="flex w-full items-center gap-2 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <ChevronRight className="h-4 w-4 text-[#999]" />
          Appearance
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />

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
            Welcome to this base! Use the tables and views to organize your
            data. Click on any cell to edit, add new records with the + button,
            and explore different views in the sidebar.
          </div>
        )}
      </div>
    </>
  );
}

function SharePopover({
  baseName,
  onClose,
}: {
  baseName: string;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"invite" | "web">("invite");
  const [email, setEmail] = useState("");

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[480px] rounded-xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
        <div className="px-5 pt-5 pb-1">
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-semibold text-[#1d1f25]">
              Share &ldquo;{baseName}&rdquo;
            </span>
            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[#bbb] text-[10px] leading-none font-semibold text-[#999]">
              i
            </div>
          </div>
        </div>

        <div className="flex border-b border-[#e8e8e8] px-5">
          {(["invite", "web"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`mr-5 py-3 text-[14px] font-medium transition-colors ${
                tab === t
                  ? "border-b-2 border-[#1d1f25] text-[#1d1f25]"
                  : "text-[#999] hover:text-[#1d1f25]"
              }`}
            >
              {t === "invite" ? "Invite collaborators" : "Share to web"}
            </button>
          ))}
        </div>

        {tab === "invite" ? (
          <div className="pb-2">
            <div className="px-5 py-4">
              <input
                type="email"
                placeholder="Invite by email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#ddd] px-4 py-3 text-[14px] text-[#1d1f25] placeholder-[#bbb] outline-none focus:border-[#2d7ff9] focus:ring-1 focus:ring-[#2d7ff9]"
              />
            </div>
            <div className="mx-5 border-t border-[#e8e8e8]" />
            <div className="px-5 pt-4 pb-2">
              <p className="mb-3 text-[13px] text-[#888]">People with access</p>
              <button className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 hover:bg-[#f5f5f5]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-[14px] font-semibold text-white">
                  O
                </div>
                <span className="flex-1 text-left text-[15px] font-semibold text-[#1d1f25]">
                  Only you have access
                </span>
                <ChevronRight className="h-4 w-4 text-[#bbb]" />
              </button>
            </div>
            <div className="mx-5 border-t border-[#e8e8e8]" />
            <div className="px-5 pt-4 pb-5">
              <p className="mb-3 text-[13px] text-[#888]">Invite via link</p>
              <button className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 hover:bg-[#f5f5f5]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                  <LinkIcon size={18} className="text-[#555]" />
                </div>
                <span className="flex-1 text-left text-[15px] font-semibold text-[#1d1f25]">
                  1 invite link
                </span>
                <ChevronRight className="h-4 w-4 text-[#bbb]" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <p className="text-[14px] text-[#666]">
              Create a public link to share this base with anyone, even if they
              don&apos;t have an Airtable account.
            </p>
            <button className="mt-4 rounded-lg bg-[#2d7ff9] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1a6fea]">
              Create public link
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export function BaseView({ baseId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTableId = searchParams.get("tableId");
  const activeViewId = searchParams.get("viewId");
  const search = searchParams.get("search") ?? "";
  const filters = useMemo<Filter[]>(
    () => parseJSON(searchParams.get("filters"), []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.get("filters")],
  );
  const sorts = useMemo<Sort[]>(
    () => parseJSON(searchParams.get("sorts"), []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.get("sorts")],
  );

  // searchDraft drives queries immediately; URL search is updated separately (for sharing).
  // This decouples query latency from the URL round-trip (~50ms faster first result).
  const [searchDraft, setSearchDraft] = useState(search);

  // When the URL search changes externally (view switch clears it, browser navigation),
  // sync it into searchDraft. We use a ref to detect genuine external changes vs. echoes
  // caused by our own updateParams call.
  const urlSearchRef = useRef(search);
  useEffect(() => {
    if (search !== urlSearchRef.current) {
      urlSearchRef.current = search;
      setSearchDraft(search);
    }
  }, [search]);

  const [hiddenFieldIds, setHiddenFieldIds] = useState<string[]>([]);
  const [searchIndex, setSearchIndex] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_MIN_WIDTH);
  const [isDragging, setIsDragging] = useState(false);

  // Clean up body cursor/select styles if the component unmounts mid-drag.
  useEffect(() => {
    if (!isDragging) return;
    return () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging]);

  const [showHistory, setShowHistory] = useState(false);
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [showBaseInfo, setShowBaseInfo] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [confirmClearTableId, setConfirmClearTableId] = useState<string | null>(null);

  const utils = api.useUtils();
  const clearData = api.table.clearData.useMutation({
    onSuccess: () => {
      void utils.record.list.reset();
      void utils.record.count.invalidate();
      setConfirmClearTableId(null);
    },
  });

  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
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
    },
    [router],
  );

  const {
    data: base,
    isLoading,
    error,
  } = api.base.getById.useQuery({ id: baseId });

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

  const activeTable = base?.tables.find((t) => t.id === activeTableId);
  const visibleFields: FieldSummary[] = useMemo(
    () =>
      (activeTable?.fields ?? []).filter((f) => !hiddenFieldIds.includes(f.id)),
    [activeTable?.fields, hiddenFieldIds],
  );

  // Lightweight count for toolbar display. TableGrid fetches rows separately via infinite query.
  // Uses searchDraft (immediate) so the count updates without waiting for the URL round-trip.
  const { data: countData, isFetching: isCountFetching } =
    api.record.count.useQuery(
      { tableId: activeTableId!, filters, search: searchDraft },
      { staleTime: 60_000, enabled: !!activeTableId },
    );

  const handleSelectView = useCallback(
    ({
      viewId,
      filters,
      sorts,
      hiddenFieldIds,
    }: {
      viewId: string;
      filters: Filter[];
      sorts: Sort[];
      hiddenFieldIds: string[];
    }) => {
      setHiddenFieldIds(hiddenFieldIds);
      updateParams({
        viewId: viewId,
        filters: filters.length ? JSON.stringify(filters) : null,
        sorts: sorts.length ? JSON.stringify(sorts) : null,
        search: null,
      });
    },
    [updateParams],
  );

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
    <>
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left icon rail */}
      <div className="flex w-[56px] shrink-0 flex-col items-center justify-between border-r border-black/10 bg-white px-2 py-2 py-4">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => router.push("/")}
            className="group flex items-center justify-center rounded p-1.5 text-[#1d1f25] hover:bg-[#f0f0f0]"
          >
            <span className="group-hover:hidden">
              <AirtableLogoIcon />
            </span>
            <span className="hidden group-hover:flex">
              <ArrowLeft className="h-5 w-5" />
            </span>
          </button>
          <button className="flex items-center justify-center rounded p-1.5 hover:bg-[#f0f0f0]">
            <AirtableRingIcon />
          </button>
        </div>
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
            <div
              className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10"
              style={{ width: 32, height: 32, backgroundColor: "#117da2" }}
            >
              <AirtableLogoIcon fill="hsla(0, 0%, 100%, 0.95)" />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowBaseInfo((v) => !v)}
                className="flex items-center gap-1 rounded px-1 py-0.5 hover:bg-[#f0f0f0]"
              >
                <span className="text-[15px] font-semibold text-[#1d1f25]">
                  {base.name}
                </span>
                <ChevronDownIcon size={14} className="text-[#1d1f25]/50" />
              </button>
              {showBaseInfo && (
                <BaseInfoPanel
                  baseName={base.name}
                  onClose={() => setShowBaseInfo(false)}
                />
              )}
            </div>
          </div>

          {/* Centered nav links — positioned absolutely so they don't shift with left/right content */}
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

          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className={`rounded-md p-1.5 transition-colors ${
                  showHistory
                    ? "bg-[#d0e5ff] text-[#2d7ff9]"
                    : "text-[#1d1f25] hover:bg-black/5"
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

            <div className="relative">
              <button
                onClick={() => setShowInviteLink((v) => !v)}
                className={`rounded-md p-1.5 transition-colors ${
                  showInviteLink
                    ? "bg-[#d0e5ff] text-[#2d7ff9]"
                    : "text-[#1d1f25] hover:bg-black/5"
                }`}
              >
                <LinkIcon size={16} />
              </button>
              {showInviteLink && (
                <InviteLinkPopup onClose={() => setShowInviteLink(false)} />
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowShare((v) => !v)}
                className="rounded-[6px] bg-[#117da2] px-3 py-1 text-[13px] font-medium text-white hover:bg-[#0e6a8a]"
              >
                Share
              </button>
              {showShare && (
                <SharePopover
                  baseName={base.name}
                  onClose={() => setShowShare(false)}
                />
              )}
            </div>
          </div>
        </div>

        <TableTabs
          baseId={baseId}
          tables={base.tables}
          activeTableId={activeTableId}
          onRequestClearData={setConfirmClearTableId}
          onSelectTable={(id) => {
            updateParams({
              tableId: id,
              viewId: null,
              search: null,
              filters: null,
              sorts: null,
            });
          }}
        />

        {activeTableId && activeTable && (
          <Toolbar
            tableId={activeTableId}
            fields={activeTable.fields}
            search={searchDraft}
            filters={filters}
            sorts={sorts}
            hiddenFieldIds={hiddenFieldIds}
            matchCount={searchDraft ? countData?.total : undefined}
            isSearching={!!searchDraft && isCountFetching}
            searchIndex={searchIndex}
            onSearchIndexChange={setSearchIndex}
            onSearchChange={(v) => {
              setSearchDraft(v);
              updateParams({ search: v });
              setSearchIndex(1);
            }}
            onFiltersChange={(v) =>
              updateParams({ filters: JSON.stringify(v) })
            }
            onSortsChange={(v) => updateParams({ sorts: JSON.stringify(v) })}
            onHiddenFieldsChange={setHiddenFieldIds}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
          />
        )}

        <div className="flex flex-1 overflow-hidden">
          {activeTableId && (
            <div
              className="shrink-0 overflow-hidden"
              style={{
                width: sidebarOpen ? sidebarWidth : 0,
                transition: isDragging ? "none" : "width 300ms ease-in-out",
              }}
            >
              <div className="h-full" style={{ width: sidebarWidth }}>
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

          {/* Resize handle */}
          {activeTableId && sidebarOpen && (
            <div
              className="group relative z-10 shrink-0 cursor-col-resize"
              style={{ width: 5 }}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                const startX = e.clientX;
                const startWidth = sidebarWidth;
                document.body.style.userSelect = "none";
                document.body.style.cursor = "col-resize";

                const onMove = (ev: MouseEvent) => {
                  const newWidth = Math.min(
                    SIDEBAR_MAX_WIDTH,
                    Math.max(
                      SIDEBAR_MIN_WIDTH,
                      startWidth + ev.clientX - startX,
                    ),
                  );
                  setSidebarWidth(newWidth);
                };

                const onUp = () => {
                  setIsDragging(false);
                  document.body.style.userSelect = "";
                  document.body.style.cursor = "";
                  document.removeEventListener("mousemove", onMove);
                  document.removeEventListener("mouseup", onUp);
                };

                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", onUp);
              }}
            >
              <div
                className={`absolute inset-y-0 left-[2px] w-px transition-colors ${isDragging ? "bg-[#2d7ff9]/60" : "bg-black/10 group-hover:bg-[#2d7ff9]/50"}`}
              />
            </div>
          )}

          {activeTableId && !sidebarOpen && (
            <div className="shrink-0 border-r border-black/10" />
          )}

          {activeTableId && activeTable && (
            <div className="flex-1 overflow-hidden">
              <TableGrid
                tableId={activeTableId}
                fields={visibleFields}
                allFields={activeTable.fields}
                search={searchDraft}
                filters={filters}
                sorts={sorts}
                searchIndex={searchIndex}
                isClearing={clearData.isPending}
                onHideField={(fieldId) => {
                  setHiddenFieldIds((prev) =>
                    prev.includes(fieldId) ? prev : [...prev, fieldId],
                  );
                }}
                onFilterByField={(fieldId) => {
                  const field = activeTable.fields.find(
                    (f) => f.id === fieldId,
                  );
                  if (!field) return;
                  const newFilter: Filter =
                    field.type === "NUMBER"
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

    {/* Clear data confirmation modal */}
    {confirmClearTableId && (() => {
      const tableName = base?.tables.find((t) => t.id === confirmClearTableId)?.name ?? "this table";
      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmClearTableId(null);
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-[400px] rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-[17px] font-semibold text-[#1d1f25]">
              Are you sure you want to clear all data in {tableName}?
            </h2>
            <p className="mt-2 text-[14px] text-[#666]">
              All records will be deleted from the {tableName} table.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmClearTableId(null)}
                disabled={clearData.isPending}
                className="rounded-md border border-[#ccc] px-4 py-1.5 text-[14px] text-[#333] hover:bg-[#f5f5f5] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => clearData.mutate({ id: confirmClearTableId })}
                disabled={clearData.isPending}
                className="flex items-center gap-2 rounded-md bg-[#bf1650] px-4 py-1.5 text-[14px] font-medium text-white hover:bg-[#a01040] disabled:opacity-70"
              >
                {clearData.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Clear data
              </button>
            </div>
          </div>
        </div>
      );
    })()}
    </>
  );
}
