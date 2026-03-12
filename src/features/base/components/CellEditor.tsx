"use client";

import { useRef, useEffect, useState, useLayoutEffect } from "react";

interface Props {
  value:     string | number | null;
  fieldType: string;
  isActive:  boolean;
  onCommit:  (value: string | number | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function CellEditor({ value, fieldType, isActive, onCommit, onKeyDown }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef   = useRef<HTMLDivElement>(null);
  const [editing, setEditing]                 = useState(false);
  const [draft, setDraft]                     = useState("");
  const [optimisticValue, setOptimisticValue] = useState<string | number | null | undefined>(undefined);

  const isNumber     = fieldType === "NUMBER";
  const committedVal = optimisticValue !== undefined ? optimisticValue : value;
  const displayValue = committedVal !== null && committedVal !== undefined ? String(committedVal) : "";

  // Clear optimistic value once parent catches up
  useEffect(() => {
    if (optimisticValue !== undefined && value === optimisticValue) {
      setOptimisticValue(undefined);
    }
  }, [value, optimisticValue]);

  // Focus div when active and not editing
  useLayoutEffect(() => {
    if (isActive && !editing) {
      divRef.current?.focus();
    }
  }, [isActive, editing]);

  // Focus input when editing starts
  // Separate effect so dep array size never changes
  useLayoutEffect(() => {
    if (!editing || !inputRef.current) return;
    inputRef.current.focus();
    if (!isNumber) {
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [editing, isNumber]);

  // Cancel edit when cell loses active state
  useEffect(() => {
    if (!isActive) {
      setEditing(false);
      setDraft("");
    }
  }, [isActive]);

  const startEditing = (initialValue?: string) => {
    setDraft(initialValue ?? displayValue);
    setEditing(true);
  };

  const commitValue = (andThen?: () => void) => {
    const trimmed = draft.trim();
    let parsed: string | number | null;
    if (isNumber) {
      const num = parseFloat(trimmed);
      parsed = isNaN(num) ? null : num;
    } else {
      parsed = trimmed === "" ? null : trimmed;
    }
    setOptimisticValue(parsed);
    onCommit(parsed);
    setEditing(false);
    setDraft("");
    andThen?.();
  };

  const cancel = () => {
    setEditing(false);
    setDraft("");
  };

  // ── Editing mode ──────────────────────────────────────────────────────────
  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { if (editing) commitValue(); }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Escape") { e.preventDefault(); cancel(); return; }
          if (e.key === "Enter")  { e.preventDefault(); commitValue(() => onKeyDown({ ...e, key: "ArrowDown" } as React.KeyboardEvent)); return; }
          if (e.key === "Tab")    { e.preventDefault(); commitValue(() => onKeyDown(e)); return; }
        }}
        type={isNumber ? "number" : "text"}
        className="absolute inset-0 z-10 w-full border-0 bg-white px-3 text-xs text-[#1f1f1f] outline-none"
      />
    );
  }

  // ── Display mode ──────────────────────────────────────────────────────────
  return (
    <div
      ref={divRef}
      tabIndex={isActive ? 0 : -1}
      className="flex h-full w-full cursor-default select-none items-center px-3 text-xs text-[#1f1f1f] focus:outline-none"
      onClick={() => { if (isActive) startEditing(); }}
      onDoubleClick={() => startEditing()}
      onKeyDown={(e) => {
        if (!isActive) return;
        if (e.key === "Enter" || e.key === "F2") { e.preventDefault(); startEditing(); return; }
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); startEditing(e.key); return; }
        if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); setOptimisticValue(null); onCommit(null); return; }
        onKeyDown(e);
      }}
    >
      <span className="truncate">{displayValue}</span>
    </div>
  );
}