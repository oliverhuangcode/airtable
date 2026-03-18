"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "~/trpc/react";
import {
  PencilIcon,
  CopyIcon,
  ChevronDownIcon,
  LinkIcon as AirtableLinkIcon,
  InfoIcon as AirtableInfoIcon,
  LockIcon as AirtableLockIcon,
  FunnelSimpleIcon,
  GroupIcon as AirtableGroupIcon,
  EyeSlashIcon,
  TrashIcon,
} from "~/components/icons/AirtableIcons";
import type { FieldSummary } from "~/types";

interface Props {
  field: FieldSummary;
  tableId: string;
  onHideField: (fieldId: string) => void;
  onFilterByField: (fieldId: string) => void;
  onDuplicated: () => void;
  onDeleted: () => void;
}

// ── Icons (unique to this menu, not in AirtableIcons) ─────────────────────

function InsertLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="text-[#666]"
      style={{ shapeRendering: "geometricPrecision" }}
    >
      <path
        fillRule="nonzero"
        d="M10.3536 3.64645C10.5488 3.84171 10.5488 4.15829 10.3536 4.35355L6.70711 8L10.3536 11.6464C10.5488 11.8417 10.5488 12.1583 10.3536 12.3536C10.1583 12.5488 9.84171 12.5488 9.64645 12.3536L5.64645 8.35355C5.45118 8.15829 5.45118 7.84171 5.64645 7.64645L9.64645 3.64645C9.84171 3.45118 10.1583 3.45118 10.3536 3.64645Z"
      />
    </svg>
  );
}

function InsertRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="text-[#666]"
      style={{ shapeRendering: "geometricPrecision" }}
    >
      <path
        fillRule="nonzero"
        d="M5.64645 3.64645C5.84171 3.45118 6.15829 3.45118 6.35355 3.64645L10.3536 7.64645C10.5488 7.84171 10.5488 8.15829 10.3536 8.35355L6.35355 12.3536C6.15829 12.5488 5.84171 12.5488 5.64645 12.3536C5.45118 12.1583 5.45118 11.8417 5.64645 11.6464L9.29289 8L5.64645 4.35355C5.45118 4.15829 5.45118 3.84171 5.64645 3.64645Z"
      />
    </svg>
  );
}

function SortAscIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="text-[#666]"
      style={{ shapeRendering: "geometricPrecision" }}
    >
      <path
        fillRule="nonzero"
        d="M3 5h10M3 8h7M3 11h4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        fillRule="nonzero"
        d="M13 8v5M13 13l-2-2M13 13l2-2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function SortDescIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="text-[#666]"
      style={{ shapeRendering: "geometricPrecision" }}
    >
      <path
        fillRule="nonzero"
        d="M3 5h4M3 8h7M3 11h10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        fillRule="nonzero"
        d="M13 3v5M13 3l-2 2M13 3l2 2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function DependenciesIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="text-[#666]"
      style={{ shapeRendering: "geometricPrecision" }}
    >
      <path
        d="M2 4h4M2 8h4M2 12h4M10 4h4M10 8h4M10 12h4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M6 4l4 4M6 12l4-4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function ColumnHeaderMenu({
  field,
  tableId,
  onHideField,
  onFilterByField,
  onDuplicated,
  onDeleted,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLButtonElement>(null);
  const utils = api.useUtils();

  const deleteField = api.field.delete.useMutation({
    onSuccess: () => {
      void utils.base.getById.invalidate();
      onDeleted();
      setIsOpen(false);
    },
  });

  const createField = api.field.create.useMutation({
    onSuccess: () => {
      void utils.base.getById.invalidate();
      onDuplicated();
      setIsOpen(false);
    },
  });

  // Close on outside click — but ignore clicks on the chevron button itself
  // so the toggle logic in the click handler works correctly
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (chevronRef.current?.contains(target)) return;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleDuplicate = useCallback(() => {
    createField.mutate({
      tableId,
      name: `${field.name} (copy)`,
      type: field.type,
    });
  }, [createField, tableId, field.name, field.type]);

  const handleDelete = useCallback(() => {
    deleteField.mutate({ id: field.id });
  }, [deleteField, field.id]);

  const handleHide = useCallback(() => {
    onHideField(field.id);
    setIsOpen(false);
  }, [onHideField, field.id]);

  const handleFilter = useCallback(() => {
    onFilterByField(field.id);
    setIsOpen(false);
  }, [onFilterByField, field.id]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {/* Chevron trigger — visible on header hover */}
      <button
        ref={chevronRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((v) => !v);
        }}
        className={`flex items-center justify-center rounded p-0.5 transition-opacity hover:bg-[#ddd] hover:text-[#333] ${
          isOpen
            ? "text-[#333] opacity-100"
            : "text-[#999] opacity-0 group-hover/header:opacity-100"
        }`}
      >
        <ChevronDownIcon size={12} />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 z-40 mt-0 w-[260px] rounded-lg border border-[#ddd] bg-white py-1.5 shadow-xl"
        >
          {/* Edit field */}
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]">
            <PencilIcon size={16} className="text-[#666]" />
            Edit field
          </button>

          <div className="mx-3 my-1 border-t border-[#eee]" />

          {/* Duplicate field */}
          <button
            onClick={handleDuplicate}
            disabled={createField.isPending}
            className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]"
          >
            <CopyIcon size={16} className="text-[#666]" />
            Duplicate field
          </button>

          {/* Insert left */}
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]">
            <InsertLeftIcon />
            Insert left
          </button>

          {/* Insert right */}
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]">
            <InsertRightIcon />
            Insert right
          </button>

          <div className="mx-3 my-1 border-t border-[#eee]" />

          {/* Copy field URL */}
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]">
            <AirtableLinkIcon size={16} className="text-[#666]" />
            Copy field URL
          </button>

          {/* Edit field description */}
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]">
            <AirtableInfoIcon size={16} className="text-[#666]" />
            Edit field description
          </button>

          {/* Edit field permissions */}
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]">
            <AirtableLockIcon size={16} className="text-[#666]" />
            Edit field permissions
          </button>

          <div className="mx-3 my-1 border-t border-[#eee]" />

          {/* Sort First → Last */}
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]">
            <SortAscIcon />
            {"Sort  First → Last"}
          </button>

          {/* Sort Last → First */}
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]">
            <SortDescIcon />
            {"Sort  Last → First"}
          </button>

          <div className="mx-3 my-1 border-t border-[#eee]" />

          {/* Filter by this field */}
          <button
            onClick={handleFilter}
            className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]"
          >
            <FunnelSimpleIcon size={16} className="text-[#666]" />
            Filter by this field
          </button>

          {/* Group by this field */}
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]">
            <AirtableGroupIcon size={16} className="text-[#666]" />
            Group by this field
          </button>

          {/* Show dependencies */}
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]">
            <DependenciesIcon />
            Show dependencies
          </button>

          <div className="mx-3 my-1 border-t border-[#eee]" />

          {/* Hide field */}
          <button
            onClick={handleHide}
            className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#1d1f25] hover:bg-[#f5f5f5]"
          >
            <EyeSlashIcon size={16} className="text-[#666]" />
            Hide field
          </button>

          {/* Delete field */}
          <button
            onClick={handleDelete}
            disabled={deleteField.isPending}
            className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-[#dc3545] hover:bg-[#fff5f5]"
          >
            <TrashIcon size={16} className="text-[#dc3545]" />
            Delete field
          </button>
        </div>
      )}
    </div>
  );
}
