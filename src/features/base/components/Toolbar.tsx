"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronUp,
  ChevronDown,
  Loader2,
  ChevronRight,
  Users,
  Pencil,
  Info,
  Copy,
  Download,
  Printer,
  Trash2,
  HelpCircle,
  Link,
  Zap,
  Code2,
  FileText,
} from "lucide-react";
import {
  EyeSlashIcon,
  FunnelSimpleIcon,
  GroupIcon as AirtableGroupIcon,
  ArrowsDownUpIcon,
  PaintBucketIcon,
  RowHeightSmallIcon,
  ArrowsOutSimpleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ListIcon as AirtableListIcon,
  GridFeatureIcon,
} from "~/components/icons/AirtableIcons";
import type { FieldSummary, Filter, Sort } from "~/types";
import { FilterPanel } from "./FilterPanel";
import { SortPanel } from "./SortPanel";
import { HideFieldsPanel } from "./HideFieldsPanel";

interface Props {
  tableId: string;
  fields: FieldSummary[];
  search: string;
  filters: Filter[];
  sorts: Sort[];
  hiddenFieldIds: string[];
  onSearchChange: (v: string) => void;
  onFiltersChange: (v: Filter[]) => void;
  onSortsChange: (v: Sort[]) => void;
  onHiddenFieldsChange: (v: string[]) => void;
  onToggleSidebar: () => void;
}

function FilterIcon({ className }: { className?: string }) {
  return <FunnelSimpleIcon size={16} className={className} />;
}

function GroupIconLocal({ className }: { className?: string }) {
  return <AirtableGroupIcon size={16} className={className} />;
}

function ColorIcon({ className }: { className?: string }) {
  return <PaintBucketIcon size={16} className={className} />;
}

function RowHeightIcon({ className }: { className?: string }) {
  return <RowHeightSmallIcon size={16} className={className} />;
}

/* ── Row height option icons ─────────────────────────── */
function ShortRowIcon({ active }: { active?: boolean }) {
  const c = active ? "#2d7ff9" : "#666";
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 6h14M2 9h14M2 12h14"
        stroke={c}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function MediumRowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 4.5h14M2 9h14M2 13.5h14"
        stroke="#666"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function TallRowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 3h14M2 9h14M2 15h14"
        stroke="#666"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ExtraTallRowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 2h14M2 10h14"
        stroke="#666"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function WrapHeadersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3 4h12M3 8h8M3 12h10"
        stroke="#666"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M14 7v4l-2-2"
        stroke="#666"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Checkmark circle icon (for status/select field) ─── */
function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="#666" strokeWidth="1.3" fill="none" />
      <path
        d="M5.5 9l2.5 2.5L12.5 7"
        stroke="#666"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Sliders icon (for conditions) ─── */
function SlidersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3 5h12M3 9h12M3 13h12"
        stroke="#666"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle
        cx="6"
        cy="5"
        r="1.5"
        fill="white"
        stroke="#666"
        strokeWidth="1.2"
      />
      <circle
        cx="12"
        cy="9"
        r="1.5"
        fill="white"
        stroke="#666"
        strokeWidth="1.2"
      />
      <circle
        cx="8"
        cy="13"
        r="1.5"
        fill="white"
        stroke="#666"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/* ─── Grid View Dropdown Menu ────────────────────────── */
function GridViewMenu({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full left-0 z-50 mt-1 w-[280px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Users className="h-[18px] w-[18px] text-[#666]" />
          <div className="flex flex-1 flex-col items-start">
            <div className="flex items-center gap-1">
              <span>Collaborative view</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#999]" />
            </div>
            <span className="text-[11px] text-[#888]">
              Editors and up can edit the view configuration
            </span>
          </div>
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Pencil className="h-[18px] w-[18px] text-[#666]" />
          Rename view
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Info className="h-[18px] w-[18px] text-[#666]" />
          Edit view description
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Copy className="h-[18px] w-[18px] text-[#666]" />
          Duplicate view
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Download className="h-[18px] w-[18px] text-[#666]" />
          Download CSV
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Printer className="h-[18px] w-[18px] text-[#666]" />
          Print view
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

/* ─── Group By Panel ─────────────────────────────────── */
function GroupByPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[280px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-[14px] font-semibold text-[#1d1f25]">
            Group by
          </span>
          <HelpCircle className="h-4 w-4 text-[#999]" />
        </div>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <div className="px-4 pt-2.5 pb-1 text-[12px] text-[#888]">
          Pick a field to group by
        </div>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <CheckCircleIcon />
          Status
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#2d7ff9] hover:bg-[#f5f5f5]">
          <ChevronDown className="h-[18px] w-[18px] text-[#2d7ff9]" />
          See all fields
        </button>
      </div>
    </>
  );
}

/* ─── Color Panel ────────────────────────────────────── */
function ColorPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[320px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f5f5f5]">
          <CheckCircleIcon />
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-[#1d1f25]">
              Select field
            </span>
            <span className="text-[12px] text-[#888]">
              Color records the same as a single select field
            </span>
          </div>
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f5f5f5]">
          <SlidersIcon />
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-[#1d1f25]">
              Conditions
            </span>
            <span className="text-[12px] text-[#888]">
              Color records based on conditions
            </span>
          </div>
        </button>
      </div>
    </>
  );
}

/* ─── Row Height Panel ───────────────────────────────── */
function RowHeightPanel({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState("short");
  const [wrapHeaders, setWrapHeaders] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[220px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="px-4 py-2 text-[12px] text-[#888]">
          Select a row height
        </div>
        {(
          [
            {
              key: "short",
              label: "Short",
              icon: <ShortRowIcon active={selected === "short"} />,
            },
            { key: "medium", label: "Medium", icon: <MediumRowIcon /> },
            { key: "tall", label: "Tall", icon: <TallRowIcon /> },
            {
              key: "extra-tall",
              label: "Extra Tall",
              icon: <ExtraTallRowIcon />,
            },
          ] as const
        ).map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSelected(opt.key)}
            className={`flex w-full items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-[#f5f5f5] ${
              selected === opt.key ? "text-[#2d7ff9]" : "text-[#1d1f25]"
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button
          onClick={() => setWrapHeaders((v) => !v)}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]"
        >
          <WrapHeadersIcon />
          Wrap headers
          {wrapHeaders && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="ml-auto"
            >
              <path
                d="M2 7l3.5 3.5L12 4"
                stroke="#2d7ff9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}

/* ─── Tools Dropdown ─────────────────────────────────── */
function ToolsExtensionsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="2"
        width="6"
        height="6"
        rx="1.5"
        stroke="#666"
        strokeWidth="1.3"
        fill="none"
      />
      <rect
        x="10"
        y="2"
        width="6"
        height="6"
        rx="1.5"
        stroke="#666"
        strokeWidth="1.3"
        fill="none"
      />
      <rect
        x="2"
        y="10"
        width="6"
        height="6"
        rx="1.5"
        stroke="#666"
        strokeWidth="1.3"
        fill="none"
      />
      <rect
        x="10"
        y="10"
        width="6"
        height="6"
        rx="1.5"
        stroke="#666"
        strokeWidth="1.3"
        fill="none"
      />
    </svg>
  );
}
function ToolsManageFieldsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <text
        x="9"
        y="14"
        textAnchor="middle"
        fill="#666"
        fontSize="13"
        fontWeight="700"
        fontFamily="sans-serif"
      >
        A
      </text>
    </svg>
  );
}
function ToolsDocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="1.5"
        width="12"
        height="15"
        rx="2"
        stroke="#666"
        strokeWidth="1.3"
        fill="none"
      />
      <path
        d="M6 5.5h6M6 9h6M6 12.5h4"
        stroke="#666"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ToolsSwapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M4 6h10M14 6l-3-3M14 6l-3 3"
        stroke="#666"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 12H4M4 12l3-3M4 12l3 3"
        stroke="#666"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ToolsChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="10" width="3" height="6" rx="0.5" fill="#666" />
      <rect x="7.5" y="6" width="3" height="10" rx="0.5" fill="#666" />
      <rect x="13" y="2" width="3" height="14" rx="0.5" fill="#666" />
    </svg>
  );
}
function ToolsBusinessBadge() {
  return (
    <span className="ml-1.5 rounded-full bg-[#e8f4fd] px-2 py-0.5 text-[11px] font-medium text-[#1b6497]">
      Business
    </span>
  );
}

export function ToolsDropdown({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[320px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f5f5f5]">
          <ToolsExtensionsIcon />
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-[#1d1f25]">
              Extensions
            </span>
            <span className="text-[12px] text-[#888]">
              Extend the functionality of your base
            </span>
          </div>
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f5f5f5]">
          <ToolsManageFieldsIcon />
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-[#1d1f25]">
              Manage fields
            </span>
            <span className="text-[12px] text-[#888]">
              Edit fields and inspect dependencies
            </span>
          </div>
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f5f5f5]">
          <ToolsDocIcon />
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-[#1d1f25]">
              Record templates
            </span>
            <span className="text-[12px] text-[#888]">
              Create records from a template
            </span>
          </div>
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f5f5f5]">
          <ToolsSwapIcon />
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-[#1d1f25]">
              Date dependencies
            </span>
            <span className="text-[12px] text-[#888]">
              Configure date shifting between dependent records
            </span>
          </div>
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f5f5f5]">
          <ToolsChartIcon />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-medium text-[#1d1f25]">
                Insights
              </span>
              <ToolsBusinessBadge />
            </div>
            <span className="text-[12px] text-[#888]">
              Understand and improve base health
            </span>
          </div>
        </button>
      </div>
    </>
  );
}

/* ─── Share and Sync Panel ───────────────────────────── */
function ShareSyncPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[280px] rounded-lg border border-[#e0e0e0] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Link className="h-[18px] w-[18px] text-[#666]" />
          Create link to view
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Zap className="h-[18px] w-[18px] text-[#666]" />
          <span className="flex-1">Sync data to another base</span>
          <ChevronRight className="h-4 w-4 text-[#999]" />
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <Code2 className="h-[18px] w-[18px] text-[#666]" />
          Embed this view
        </button>
        <div className="mx-3 border-t border-[#e8e8e8]" />
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1d1f25] hover:bg-[#f5f5f5]">
          <FileText className="h-[18px] w-[18px] text-[#666]" />
          Create a form view
        </button>
      </div>
    </>
  );
}

interface SearchProps {
  matchCount?: number;
  isSearching?: boolean;
  searchIndex: number;
  onSearchIndexChange: (i: number) => void;
}

export function Toolbar({
  fields,
  search,
  filters,
  sorts,
  hiddenFieldIds,
  matchCount,
  isSearching,
  searchIndex,
  onSearchIndexChange,
  onSearchChange,
  onFiltersChange,
  onSortsChange,
  onHiddenFieldsChange,
  onToggleSidebar,
}: Props & SearchProps) {
  const [openPanel, setOpenPanel] = useState<
    | "filter"
    | "sort"
    | "hide"
    | "gridView"
    | "group"
    | "color"
    | "rowHeight"
    | "shareSync"
    | "tools"
    | null
  >(null);
  const [searchOpen, setSearchOpen] = useState(() => search.length > 0);
  const [localSearch, setLocalSearch] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  // Tracks the last value we propagated upstream so we can ignore our own URL echo
  const lastPropagatedSearch = useRef(search);

  // Sync incoming search prop to local (e.g. view switch), but ignore our own echoes
  useEffect(() => {
    if (search !== lastPropagatedSearch.current) {
      setLocalSearch(search);
    }
    if (search.length > 0) setSearchOpen(true);
  }, [search]);

  // Debounce local → parent (50ms batches rapid keystrokes without perceptible delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      lastPropagatedSearch.current = localSearch;
      onSearchChangeRef.current(localSearch);
    }, 50);
    return () => clearTimeout(timer);
  }, [localSearch]);

  // Auto-focus when search bar opens
  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [searchOpen]);

  const handleSearchClose = () => {
    setSearchOpen(false);
    setLocalSearch("");
    lastPropagatedSearch.current = "";
    onSearchChangeRef.current("");
  };

  const toggle = (panel: typeof openPanel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  return (
    <div className="relative flex-shrink-0 border-b border-black/10 bg-white">
      {/* Invisible backdrop to close panels on click-off */}
      {openPanel && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setOpenPanel(null)}
        />
      )}
      <div className="flex h-[48px] items-center pr-2 pl-3">
        {/* Grid view selector — left side */}
        <div className="relative flex items-center gap-0.5">
          <button
            onClick={onToggleSidebar}
            className="rounded p-1.5 text-[#666] transition-colors hover:bg-[#f0f0f0]"
          >
            <AirtableListIcon size={16} />
          </button>
          <button
            onClick={() => toggle("gridView")}
            className="flex items-center gap-1.5 rounded px-2 py-1 hover:bg-[#f0f0f0]"
          >
            <GridFeatureIcon
              size={16}
              fill="rgb(22, 110, 225)"
              className="shrink-0"
            />
            <span className="text-[13px] font-normal text-[#1d1f25]">
              Grid view
            </span>
            <ChevronDownIcon size={12} className="text-[#888]" />
          </button>
          {openPanel === "gridView" && (
            <GridViewMenu onClose={() => setOpenPanel(null)} />
          )}
        </div>

        {/* Spacer to push toolbar buttons right */}
        <div className="flex-1" />

        {/* Toolbar buttons — each with panel has a relative wrapper */}
        <div className="flex items-center gap-0.5">
          {/* Hide fields */}
          <div className="relative">
            <ToolbarButton
              icon={<EyeSlashIcon size={14} />}
              label="Hide fields"
              active={openPanel === "hide"}
              badge={
                hiddenFieldIds.length > 0 ? hiddenFieldIds.length : undefined
              }
              onClick={() => toggle("hide")}
            />
            {openPanel === "hide" && (
              <HideFieldsPanel
                fields={fields}
                hiddenFieldIds={hiddenFieldIds}
                onChange={onHiddenFieldsChange}
                onClose={() => setOpenPanel(null)}
              />
            )}
          </div>

          {/* Filter */}
          <div className="relative">
            <ToolbarButton
              icon={<FilterIcon className="h-3.5 w-3.5" />}
              label="Filter"
              active={openPanel === "filter"}
              badge={filters.length > 0 ? filters.length : undefined}
              onClick={() => toggle("filter")}
            />
            {openPanel === "filter" && (
              <FilterPanel
                fields={fields}
                filters={filters}
                onChange={onFiltersChange}
                onClose={() => setOpenPanel(null)}
              />
            )}
          </div>

          {/* Group */}
          <div className="relative">
            <ToolbarButton
              icon={<GroupIconLocal className="h-3.5 w-3.5" />}
              label="Group"
              active={openPanel === "group"}
              onClick={() => toggle("group")}
            />
            {openPanel === "group" && (
              <GroupByPanel onClose={() => setOpenPanel(null)} />
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <ToolbarButton
              icon={<ArrowsDownUpIcon size={14} />}
              label="Sort"
              active={openPanel === "sort"}
              badge={sorts.length > 0 ? sorts.length : undefined}
              onClick={() => toggle("sort")}
            />
            {openPanel === "sort" && (
              <SortPanel
                fields={fields}
                sorts={sorts}
                onChange={onSortsChange}
                onClose={() => setOpenPanel(null)}
              />
            )}
          </div>

          {/* Color */}
          <div className="relative">
            <ToolbarButton
              icon={<ColorIcon className="h-3.5 w-3.5" />}
              label="Color"
              active={openPanel === "color"}
              onClick={() => toggle("color")}
            />
            {openPanel === "color" && (
              <ColorPanel onClose={() => setOpenPanel(null)} />
            )}
          </div>

          {/* Row height */}
          <div className="relative">
            <button
              className={`flex items-center rounded p-1.5 transition-colors ${
                openPanel === "rowHeight"
                  ? "bg-[#d0e5ff] text-[#2d7ff9]"
                  : "text-[#666] hover:bg-[#f0f0f0]"
              }`}
              onClick={() => toggle("rowHeight")}
            >
              <RowHeightIcon className="h-3.5 w-3.5" />
            </button>
            {openPanel === "rowHeight" && (
              <RowHeightPanel onClose={() => setOpenPanel(null)} />
            )}
          </div>

          {/* Share and sync */}
          <div className="relative">
            <ToolbarButton
              icon={<ArrowsOutSimpleIcon size={14} />}
              label="Share and sync"
              active={openPanel === "shareSync"}
              onClick={() => toggle("shareSync")}
            />
            {openPanel === "shareSync" && (
              <ShareSyncPanel onClose={() => setOpenPanel(null)} />
            )}
          </div>
        </div>

        {/* Search toggle button */}
        <button
          onClick={() => setSearchOpen((v) => !v)}
          className={`ml-1 rounded p-1.5 transition-colors ${
            searchOpen
              ? "bg-[#d0e5ff] text-[#2d7ff9]"
              : "text-[#666] hover:bg-[#f0f0f0]"
          }`}
        >
          <MagnifyingGlassIcon size={16} />
        </button>
      </div>

      {/* Search floating overlay — drops from the search icon */}
      {searchOpen && (
        <div className="absolute top-full right-2 z-40 mt-0.5 flex w-[380px] items-center gap-1.5 rounded-lg border border-[#ddd] bg-white px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <input
            ref={inputRef}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleSearchClose();
              if (e.key === "Enter") {
                if (e.shiftKey)
                  onSearchIndexChange(Math.max(1, searchIndex - 1));
                else if (matchCount)
                  onSearchIndexChange(
                    searchIndex < matchCount ? searchIndex + 1 : 1,
                  );
              }
            }}
            placeholder="Find in view..."
            className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1f1f1f] outline-none placeholder:text-[#999]"
          />
          {/* Match count / loading */}
          {localSearch.trim() && (
            <span className="flex shrink-0 items-center gap-1 text-[12px] whitespace-nowrap text-[#888] tabular-nums">
              {isSearching ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : matchCount !== undefined ? (
                `${matchCount > 0 ? searchIndex : 0} of ${matchCount.toLocaleString()}`
              ) : null}
            </span>
          )}
          {/* Prev / Next arrows */}
          <button
            onClick={() => onSearchIndexChange(Math.max(1, searchIndex - 1))}
            className="shrink-0 rounded p-0.5 text-[#888] hover:bg-[#f0f0f0] hover:text-[#444]"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              if (matchCount)
                onSearchIndexChange(
                  searchIndex < matchCount ? searchIndex + 1 : 1,
                );
            }}
            className="shrink-0 rounded p-0.5 text-[#888] hover:bg-[#f0f0f0] hover:text-[#444]"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleSearchClose}
            className="shrink-0 rounded p-0.5 text-[#888] hover:bg-[#f0f0f0] hover:text-[#444]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 rounded px-2 py-1.5 text-[13px] transition-colors ${
        active
          ? "bg-[#d0e5ff] text-[#2d7ff9]"
          : "text-[#1d1f25]/80 hover:bg-black/5"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {label && <span>{label}</span>}
      {badge !== undefined && (
        <span className="flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#2d7ff9] px-0.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}
