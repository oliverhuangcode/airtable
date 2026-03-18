"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import type { FieldSummary } from "~/types";

interface HidePanelProps {
  fields: FieldSummary[];
  hiddenFieldIds: string[];
  onChange: (ids: string[]) => void;
  onClose: () => void;
}

function FieldTypeIcon({ type }: { type: string }) {
  if (type === "NUMBER") {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0 text-[#666]"
      >
        <text
          x="2"
          y="13"
          fontSize="13"
          fontWeight="600"
          fill="currentColor"
          fontFamily="monospace"
        >
          #
        </text>
      </svg>
    );
  }
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-[#666]"
    >
      <rect x="2" y="3" width="12" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="2" y="7" width="9" height="1.5" rx="0.75" fill="currentColor" />
      <rect
        x="2"
        y="11"
        width="11"
        height="1.5"
        rx="0.75"
        fill="currentColor"
      />
    </svg>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative h-[14px] w-[26px] shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#166b3a]" : "bg-[#ccc]"
      }`}
    >
      <span
        className={`absolute top-[2px] left-[2px] h-[10px] w-[10px] rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[12px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// 3-dot vertical grip icon (thinner than lucide MoreVertical)
function GripDots() {
  return (
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      fill="none"
      className="shrink-0 text-[#ccc]"
    >
      <circle cx="4" cy="3" r="1" fill="currentColor" />
      <circle cx="4" cy="7" r="1" fill="currentColor" />
      <circle cx="4" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

export function HideFieldsPanel({
  fields,
  hiddenFieldIds,
  onChange,
  onClose: _onClose,
}: HidePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = (id: string) => {
    onChange(
      hiddenFieldIds.includes(id)
        ? hiddenFieldIds.filter((f) => f !== id)
        : [...hiddenFieldIds, id],
    );
  };

  const hideAll = () => onChange(fields.map((f) => f.id));
  const showAll = () => onChange([]);

  const filteredFields = fields.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="absolute top-full right-0 z-30 mt-1 w-[280px] rounded-lg border border-[#ddd] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      {/* Search header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find a field"
          className="flex-1 bg-transparent text-[13px] text-[#1f1f1f] outline-none placeholder:text-[#999]"
          autoFocus
        />
        <HelpCircle className="h-3.5 w-3.5 shrink-0 text-[#ccc]" />
      </div>

      {/* Field list */}
      <div className="max-h-[320px] overflow-y-auto py-2">
        {filteredFields.map((field) => {
          const isVisible = !hiddenFieldIds.includes(field.id);
          return (
            <div
              key={field.id}
              className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#f5f5f5]"
            >
              <Toggle checked={isVisible} onChange={() => toggle(field.id)} />
              <FieldTypeIcon type={field.type} />
              <span className="flex-1 truncate text-[13px] text-[#333]">
                {field.name}
              </span>
              <GripDots />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex gap-2 px-3 py-2.5">
        <button
          onClick={hideAll}
          className="flex-1 rounded-md bg-[#f5f5f5] py-2 text-[13px] text-[#333] hover:bg-[#eee]"
        >
          Hide all
        </button>
        <button
          onClick={showAll}
          className="flex-1 rounded-md bg-[#f5f5f5] py-2 text-[13px] text-[#333] hover:bg-[#eee]"
        >
          Show all
        </button>
      </div>
    </div>
  );
}
