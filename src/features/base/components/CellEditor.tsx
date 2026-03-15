"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  value:     string | number | null;
  fieldType: string;
  isActive:  boolean;
  onCommit:  (value: string | number | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function CellEditor({ value, fieldType, isActive, onCommit, onKeyDown }: Props) {
  const [editing, setEditing]     = useState(false);
  const [draft,   setDraft]       = useState("");
  const inputRef                  = useRef<HTMLInputElement>(null);
  const isNumber                  = fieldType === "NUMBER";

  // Enter edit mode on double-click or Enter key
  const startEditing = () => {
    setDraft(value != null ? String(value) : "");
    setEditing(true);
  };

  const commitEdit = useCallback(() => {
    if (!editing) return;
    setEditing(false);
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
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [editing]);

  // Exit edit mode when cell loses active state
  useEffect(() => {
    if (!isActive && editing) {
      commitEdit();
    }
  }, [isActive, editing, commitEdit]);

  const displayValue = value != null ? String(value) : "";

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={isNumber ? "number" : "text"}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
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
          }
        }}
        className={`h-full w-full border-0 bg-white px-[10px] py-0 text-[13px] text-[#1f1f1f] outline-none ${
          isNumber ? "text-right" : "text-left"
        }`}
        style={{ fontFamily: "inherit" }}
      />
    );
  }

  return (
    <div
      tabIndex={0}
      onDoubleClick={startEditing}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "F2") {
          e.preventDefault();
          startEditing();
          return;
        }
        onKeyDown(e);
      }}
      className={`flex h-full w-full cursor-default items-center px-[10px] text-[13px] text-[#1f1f1f] outline-none ${
        isNumber ? "justify-end" : "justify-start"
      }`}
    >
      <span className="truncate">{displayValue}</span>
    </div>
  );
}