// src/features/base/components/ViewToolbar.tsx
"use client";

import {
  EyeOff,
  Filter,
  Layers,
  ArrowUpDown,
  Palette,
  AlignJustify,
  Share2,
  Search,
  ChevronDown,
  LayoutGrid,
  Menu,
} from "lucide-react";

interface Props {
  search?:      string;
  onSearch?:    (v: string) => void;
  onFilterOpen: () => void;
  onSortOpen:   () => void;
  filterCount:  number;
  sortCount:    number;
}

function ToolbarButton({
  icon,
  label,
  onClick,
  badge,
}: {
  icon:    React.ReactNode;
  label:   string;
  onClick?: () => void;
  badge?:  number;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-1.25 rounded px-2 py-1.25 text-[13px] text-[#444] transition-colors hover:bg-[#ebebeb]"
    >
      <span className="shrink-0 text-[#666]">{icon}</span>
      <span>{label}</span>
      {badge != null && badge > 0 && (
        <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1170cb] px-1 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

export function ViewToolbar({ search: _search, onSearch: _onSearch, onFilterOpen, onSortOpen, filterCount, sortCount }: Props) {
  return (
    <div className="flex h-11 shrink-0 items-center border-b border-[#e0e0e0] bg-white px-2">
      {/* Left: hamburger + view selector */}
      <div className="flex items-center gap-1">
        <button className="rounded p-1.5 text-[#666] hover:bg-[#ebebeb]">
          <Menu className="h-3.75 w-3.75" />
        </button>

        <button className="flex items-center gap-1.25 rounded px-2 py-1.25 text-[13px] font-medium text-[#1f1f1f] hover:bg-[#ebebeb]">
          <LayoutGrid className="h-3.5 w-3.5 text-[#1170cb]" />
          <span>Grid view</span>
          <ChevronDown className="h-3.25 w-3.25 text-[#888]" />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-2 h-5 w-px bg-[#e0e0e0]" />

      {/* Right toolbar buttons */}
      <div className="flex flex-1 items-center gap-0.5">
        <ToolbarButton icon={<EyeOff className="h-3.5 w-3.5" />} label="Hide fields" />
        <ToolbarButton
          icon={<Filter className="h-3.5 w-3.5" />}
          label="Filter"
          onClick={onFilterOpen}
          badge={filterCount}
        />
        <ToolbarButton icon={<Layers className="h-3.5 w-3.5" />} label="Group" />
        <ToolbarButton
          icon={<ArrowUpDown className="h-3.5 w-3.5" />}
          label="Sort"
          onClick={onSortOpen}
          badge={sortCount}
        />
        <ToolbarButton icon={<Palette className="h-3.5 w-3.5" />} label="Color" />
        <ToolbarButton icon={<AlignJustify className="h-3.5 w-3.5" />} label="" />
        <ToolbarButton icon={<Share2 className="h-3.5 w-3.5" />} label="Share and sync" />
      </div>

      {/* Search */}
      <button className="rounded p-1.5 text-[#666] hover:bg-[#ebebeb]">
        <Search className="h-3.75 w-3.75" />
      </button>
    </div>
  );
}
