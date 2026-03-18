// src/features/bases/components/AppShell.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  HelpCircle,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  Star,
  Share2,
  Users2,
  LayoutTemplate,
  ShoppingBag,
  Upload,
  Home,
  Loader2,
} from "lucide-react";
import { api } from "~/trpc/react";

export type ActivePage = "home" | "starred" | "shared" | "workspaces";

interface AppShellProps {
  activePage: ActivePage;
  children: React.ReactNode;
}

export function AppShell({ activePage, children }: AppShellProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [newBaseName, setNewBaseName] = useState("");

  const utils = api.useUtils();
  const createBase = api.base.create.useMutation({
    onSuccess: (newBase) => {
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

  // Starred section is expanded when not on starred/shared pages
  const starredExpanded = activePage === "home" || activePage === "workspaces";

  const baseNavClass = (page: ActivePage) =>
    `flex w-full items-center gap-2 rounded-md px-2 py-[7px] text-[13.5px] font-medium transition-colors ${
      activePage === page
        ? "bg-[#f0f0f0] text-[#1f1f1f]"
        : "text-[#333] hover:bg-[#f5f5f5]"
    }`;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside className="flex w-[290px] flex-shrink-0 flex-col border-r border-[#e3e3e3]">
        {/* Logo */}
        <div className="flex h-[57px] items-center gap-2 px-3">
          <button className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-[#f2f2f2]">
            <Menu className="h-[18px] w-[18px] text-[#6b6b6b]" />
          </button>
          <AirtableLogo />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 pt-1">
          {/* Home */}
          <button
            onClick={() => router.push("/")}
            className={baseNavClass("home")}
          >
            <Home className="h-[15px] w-[15px] text-[#6b6b6b]" />
            <span className="flex-1 text-left">Home</span>
          </button>

          {/* Starred — link + separate expand button, matching Airtable structure */}
          <div className="mt-0.5">
            <div
              className={`flex w-full items-center rounded-md transition-colors ${
                activePage === "starred" ? "bg-[#f0f0f0]" : "hover:bg-[#f5f5f5]"
              }`}
            >
              <button
                onClick={() => router.push("/starred")}
                className="flex flex-1 items-center gap-2 px-2 py-[7px] text-[13.5px] font-medium text-[#333]"
              >
                <Star className="h-[15px] w-[15px] text-[#6b6b6b]" />
                <span className="flex-1 text-left">Starred</span>
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded text-[#bbb] transition-colors hover:text-[#888]">
                {starredExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            {starredExpanded && (
              <div className="mx-1 flex items-start gap-2 px-2 py-2">
                <Star className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#ccc]" />
                <p className="text-[12px] leading-snug text-[#aaa]">
                  Your starred bases, interfaces, and workspaces will appear
                  here
                </p>
              </div>
            )}
          </div>

          {/* Shared */}
          <div className="mt-0.5">
            <button
              onClick={() => router.push("/shared")}
              className={baseNavClass("shared")}
            >
              <Share2 className="h-[15px] w-[15px] text-[#6b6b6b]" />
              <span className="flex-1 text-left">Shared</span>
            </button>
          </div>

          {/* Workspaces */}
          <div className="mt-0.5">
            <div
              className={`flex w-full items-center rounded-md transition-colors ${
                activePage === "workspaces"
                  ? "bg-[#f0f0f0]"
                  : "hover:bg-[#f5f5f5]"
              }`}
            >
              <button
                onClick={() => router.push("/workspaces")}
                className="flex flex-1 items-center gap-2 px-2 py-[7px] text-[13.5px] font-medium text-[#333]"
              >
                <Users2 className="h-[15px] w-[15px] text-[#6b6b6b]" />
                <span className="flex-1 text-left">Workspaces</span>
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded text-[#bbb] transition-colors hover:text-[#888]">
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded text-[#bbb] transition-colors hover:text-[#888]">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-[#e3e3e3] px-2 py-2">
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-[7px] text-[13px] text-[#555] transition-colors hover:bg-[#f5f5f5]">
            <LayoutTemplate className="h-[15px] w-[15px] text-[#6b6b6b]" />
            Templates and apps
          </button>
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-[7px] text-[13px] text-[#555] transition-colors hover:bg-[#f5f5f5]">
            <ShoppingBag className="h-[15px] w-[15px] text-[#6b6b6b]" />
            Marketplace
          </button>
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-[7px] text-[13px] text-[#555] transition-colors hover:bg-[#f5f5f5]">
            <Upload className="h-[15px] w-[15px] text-[#6b6b6b]" />
            Import
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#1464e8] px-4 py-[9px] text-[13.5px] font-semibold text-white transition-colors hover:bg-[#1258cf]"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-[57px] flex-shrink-0 items-center border-b border-[#e3e3e3] bg-white px-6">
          <div className="flex flex-1 justify-center">
            <button className="flex w-[400px] items-center gap-2 rounded-full border border-[#e3e3e3] bg-white px-4 py-[7px] text-[13px] text-[#aaa] transition-colors hover:border-[#c8c8c8]">
              <Search className="h-[15px] w-[15px]" />
              <span className="flex-1 text-left">Search...</span>
              <span className="text-[12px] text-[#ccc]">⌘ K</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#e3e3e3] text-[#666] transition-colors hover:bg-[#f5f5f5]">
              <HelpCircle className="h-[15px] w-[15px]" />
            </button>
            <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#e3e3e3] text-[#666] transition-colors hover:bg-[#f5f5f5]">
              <Bell className="h-[15px] w-[15px]" />
            </button>
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#7b5ea7] text-[12px] font-semibold text-white select-none">
              O
            </div>
          </div>
        </header>

        {/* Create modal */}
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-[380px] rounded-xl border border-[#e3e3e3] bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-[15px] font-semibold text-[#1f1f1f]">
                Create a base
              </h2>
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
                className="mb-4 w-full rounded-lg border border-[#e3e3e3] px-3 py-2 text-sm text-[#1f1f1f] outline-none placeholder:text-[#aaa] focus:border-[#1464e8]"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="rounded-lg px-4 py-2 text-sm text-[#666] transition-colors hover:bg-[#f5f5f5]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={createBase.isPending || !newBaseName.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-[#1464e8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1258cf] disabled:opacity-50"
                >
                  {createBase.isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Create base
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}

function AirtableLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="22" height="19" viewBox="0 0 200 170" fill="none">
        <path
          d="M90.039 12.074L9.439 44.605c-4.894 1.898-4.858 8.763.057 10.606l80.931 30.733a29.89 29.89 0 0021.147 0l80.931-30.733c4.915-1.843 4.951-8.708.057-10.606L111.162 12.074a29.89 29.89 0 00-21.123 0z"
          fill="#FCB400"
        />
        <path
          d="M105.93 95.172v78.086c0 3.716 3.77 6.218 7.22 4.804l89.773-35.942a5.225 5.225 0 003.256-4.803V79.23c0-3.716-3.77-6.218-7.22-4.804l-89.773 35.942a5.225 5.225 0 00-3.256 4.804z"
          fill="#18BFFF"
        />
        <path
          d="M88.428 98.613L4.656 60.82C1.176 59.149-2.374 61.857-2.374 65.749v78.264a5.225 5.225 0 002.9 4.693l83.9 39.692c3.479 1.645 7.456-.968 7.456-4.87v-80.17a5.225 5.225 0 00-3.454-4.745z"
          fill="#F82B60"
        />
      </svg>
      <span className="text-[15px] font-bold text-[#1f1f1f]">Airtable</span>
    </div>
  );
}
