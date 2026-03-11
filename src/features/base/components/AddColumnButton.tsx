"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Plus, Loader2 } from "lucide-react";

interface Props {
  tableId: string;
}

export function AddColumnButton({ tableId }: Props) {
  const [isOpen, setIsOpen]   = useState(false);
  const [name, setName]       = useState("");
  const [type, setType]       = useState<"TEXT" | "NUMBER">("TEXT");
  const utils                 = api.useUtils();

  // ── WRITE: create field ───────────────────────────────────────────────────
  const createField = api.field.create.useMutation({
    onSuccess: () => {
      // invalidate base so field list in header updates
      void utils.base.getById.invalidate();
      setName("");
      setIsOpen(false);
    },
  });

  const handleCreate = () => {
    if (!name.trim()) return;
    createField.mutate({ tableId, name: name.trim(), type });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-[52px] flex-shrink-0 items-center justify-center text-[#999] hover:bg-[#f4f4f4] hover:text-[#1f1f1f] transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-[#e0e0e0] bg-white p-3 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="mb-2 text-xs font-medium text-[#1f1f1f]">Add column</p>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCreate();
          if (e.key === "Escape") setIsOpen(false);
        }}
        placeholder="Column name..."
        className="mb-2 w-full rounded border border-[#e0e0e0] px-2 py-1.5 text-xs outline-none focus:border-[#1170cb]"
      />
      <div className="mb-3 flex gap-2">
        {(["TEXT", "NUMBER"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`
              flex-1 rounded border py-1 text-xs font-medium transition-colors
              ${type === t
                ? "border-[#1170cb] bg-[#e8f0fe] text-[#1170cb]"
                : "border-[#e0e0e0] text-[#666] hover:border-[#999]"
              }
            `}
          >
            {t === "TEXT" ? "Text" : "Number"}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleCreate}
          disabled={createField.isPending || !name.trim()}
          className="flex-1 rounded bg-[#1170cb] py-1.5 text-xs font-medium text-white disabled:opacity-50 hover:bg-[#0e5fad] transition-colors"
        >
          {createField.isPending ? (
            <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
          ) : (
            "Add column"
          )}
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded border border-[#e0e0e0] px-3 py-1.5 text-xs text-[#666] hover:bg-[#f4f4f4] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
