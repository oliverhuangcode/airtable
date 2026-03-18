// src/features/bases/components/SharedView.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, AlignJustify, Grid2X2 } from "lucide-react";
import { AppShell } from "./AppShell";

export function SharedView() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <AppShell activePage="shared">
      <main className="flex-1 overflow-y-auto bg-[#f8f8f8] px-8 py-8">
        <h1 className="mb-6 text-[26px] font-bold text-[#1f1f1f]">Shared</h1>

        {/* Filters + view toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 rounded px-2 py-1 text-[13px] text-[#555] transition-colors hover:bg-[#ebebeb]">
              Show all
              <ChevronDown className="h-3.5 w-3.5 text-[#888]" />
            </button>
            <button className="flex items-center gap-1 rounded px-2 py-1 text-[13px] text-[#555] transition-colors hover:bg-[#ebebeb]">
              Date shared
              <ChevronDown className="h-3.5 w-3.5 text-[#888]" />
            </button>
          </div>
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

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-[17px] font-semibold text-[#1f1f1f]">
            You don&apos;t have any shared apps
          </p>
          <p className="mt-2 max-w-sm text-[13px] text-[#888]">
            Apps that have been shared with you will appear here.
          </p>
          <button
            onClick={() => router.push("/workspaces")}
            className="mt-6 rounded-lg border border-[#e3e3e3] bg-white px-4 py-2 text-[13.5px] font-medium text-[#333] transition-colors hover:bg-[#f5f5f5]"
          >
            Go to all workspaces
          </button>
        </div>
      </main>
    </AppShell>
  );
}
