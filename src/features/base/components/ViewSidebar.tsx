// src/features/base/components/ViewSidebar.tsx
"use client";

import { Plus, Search, Settings, LayoutGrid } from "lucide-react";

interface View {
  id:   string;
  name: string;
}

interface Props {
  views:         View[];
  activeViewId:  string;
  onViewSelect:  (id: string) => void;
  onCreateView:  () => void;
}

export function ViewSidebar({ views, activeViewId, onViewSelect, onCreateView }: Props) {
  return (
    <div className="flex h-full w-67 shrink-0 flex-col border-r border-[#e0e0e0] bg-white">
      {/* Create new button */}
      <button
        onClick={onCreateView}
        className="flex items-center gap-2 px-4 py-3 text-[13px] text-[#555] transition-colors hover:bg-[#f5f5f5]"
      >
        <Plus className="h-3.5 w-3.5 text-[#888]" />
        <span>Create new...</span>
      </button>

      {/* Find a view */}
      <div className="flex items-center gap-2 border-b border-[#f0f0f0] px-4 pb-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-[#e0e0e0] bg-white px-2.5 py-1.25">
          <Search className="h-3.25 w-3.25 shrink-0 text-[#aaa]" />
          <span className="text-[12px] text-[#bbb]">Find a view</span>
        </div>
        <button className="rounded p-1 text-[#aaa] hover:bg-[#f0f0f0] hover:text-[#666]">
          <Settings className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Views list */}
      <div className="flex-1 overflow-y-auto py-1">
        {views.map((view) => {
          const isActive = view.id === activeViewId;
          return (
            <button
              key={view.id}
              onClick={() => onViewSelect(view.id)}
              className={`flex w-full items-center gap-2 px-3 py-1.75 text-left transition-colors ${
                isActive
                  ? "bg-[#e8f0fd] text-[#1170cb]"
                  : "text-[#333] hover:bg-[#f5f5f5]"
              }`}
            >
              <LayoutGrid className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-[#1170cb]" : "text-[#888]"}`} />
              <span className="truncate text-[13px] font-medium">{view.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}