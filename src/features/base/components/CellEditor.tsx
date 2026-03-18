"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  value: string | number | null;
  fieldType: string;
  isActive: boolean;
  entryMode?: "replace" | "append";
  onCommit: (value: string | number | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function CellEditor({
  value,
  fieldType,
  isActive,
  entryMode: _entryMode = "replace",
  onCommit,
  onKeyDown,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [hideCaret, setHideCaret] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isNumber = fieldType === "NUMBER";

  const startEditing = (mode: "replace" | "append", initialChar?: string) => {
    if (initialChar !== undefined) {
      // User typed a character while cell was selected — start fresh with that char
      setDraft(initialChar);
      setHideCaret(false);
      setHasTyped(true);
    } else {
      setDraft(value != null ? String(value) : "");
      setHideCaret(mode === "replace");
      setHasTyped(false);
    }
    setEditing(true);
  };

  const commitEdit = useCallback(() => {
    if (!editing) return;
    setEditing(false);
    setHideCaret(false);
    setHasTyped(false);
    if (isNumber) {
      const n = parseFloat(draft);
      onCommit(isNaN(n) ? null : n);
    } else {
      onCommit(draft === "" ? null : draft);
    }
  }, [editing, isNumber, draft, onCommit]);

  useEffect(() => {
    if (editing) {
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;
        el.focus();
        if (hideCaret) {
          // Replace mode: select all so first keystroke replaces, highlight hidden via CSS
          el.select();
        } else if (!isNumber) {
          // Append mode: place cursor at end
          const len = el.value.length;
          el.setSelectionRange(len, len);
        }
      });
    }
  }, [editing, hideCaret, isNumber]);

  // Commit when navigated away; do NOT auto-enter edit on activation (Airtable model)
  useEffect(() => {
    if (!isActive && editing) {
      commitEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const displayValue = value != null ? String(value) : "";

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={isNumber ? "number" : "text"}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          if (!hasTyped) setHasTyped(true);
          // Once user starts typing, show the caret
          if (hideCaret) setHideCaret(false);
        }}
        onBlur={commitEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") {
            e.preventDefault();
            commitEdit();
            onKeyDown(e);
          } else if (e.key === "Tab") {
            e.preventDefault();
            commitEdit();
            onKeyDown(e);
          } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            commitEdit();
            onKeyDown(e);
          }
        }}
        className={`h-full w-full border-0 bg-transparent px-2.5 py-0 text-[13px] outline-none ${
          hideCaret && !hasTyped ? "text-[#1170cb]" : "text-[#1d1f25]"
        } ${hideCaret ? "cell-no-select" : ""} ${isNumber ? "text-right" : "text-left"}`}
        style={{
          fontFamily: "inherit",
          caretColor: hideCaret ? "transparent" : undefined,
          ...(hideCaret
            ? { WebkitTextFillColor: hasTyped ? "#1d1f25" : "#1170cb" }
            : {}),
        }}
      />
    );
  }

  return (
    <div
      tabIndex={0}
      onDoubleClick={() => startEditing("append")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "F2") {
          e.preventDefault();
          startEditing("append");
          return;
        }
        // Backspace/Delete — clear cell and enter edit mode
        if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          startEditing("replace", "");
          return;
        }
        // Printable character — start editing with that char (replaces content)
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          if (isNumber && !/[\d.\-]/.test(e.key)) return;
          startEditing("replace", e.key);
          return;
        }
        // Arrow keys, Tab, Escape — navigate
        onKeyDown(e);
      }}
      className={`flex h-full w-full cursor-default items-center px-2.5 text-[13px] text-[#1d1f25] outline-none ${
        isNumber ? "justify-end" : "justify-start"
      }`}
    >
      <span className="truncate">{displayValue}</span>
    </div>
  );
}
