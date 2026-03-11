"use client";

import { useRef, useEffect, useState } from "react";

interface Props {
  value:     string | number | null;
  fieldType: string;
  isActive:  boolean;
  onCommit:  (value: string | number | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function CellEditor({ value, fieldType, isActive, onCommit, onKeyDown }: Props) {
  const inputRef      = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<string>("");
  const [editing, setEditing] = useState(false);

  // focus input when cell becomes active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // reset draft when cell is deactivated
  useEffect(() => {
    if (!isActive) {
      setEditing(false);
      setDraft("");
    }
  }, [isActive]);

  const displayValue = value !== null && value !== undefined ? String(value) : "";

  const handleCommit = () => {
    if (!editing) return;
    const trimmed = draft.trim();

    if (fieldType === "NUMBER") {
      const num = parseFloat(trimmed);
      onCommit(isNaN(num) ? null : num);
    } else {
      onCommit(trimmed === "" ? null : trimmed);
    }
    setEditing(false);
  };

  if (isActive && editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCommit();
            return;
          }
          if (e.key === "Escape") {
            setEditing(false);
            setDraft("");
            return;
          }
          onKeyDown(e);
        }}
        type={fieldType === "NUMBER" ? "number" : "text"}
        className="absolute inset-0 w-full bg-white px-3 text-xs text-[#1f1f1f] outline-none"
      />
    );
  }

  return (
    <div
      className="flex h-full w-full cursor-default items-center px-3 text-xs text-[#1f1f1f]"
      onDoubleClick={() => {
        setDraft(displayValue);
        setEditing(true);
      }}
      onKeyDown={(e) => {
        // start editing on printable key
        if (isActive && e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
          setDraft(e.key);
          setEditing(true);
          return;
        }
        onKeyDown(e);
      }}
      tabIndex={isActive ? 0 : -1}
    >
      <span className="truncate">{displayValue}</span>
    </div>
  );
}
