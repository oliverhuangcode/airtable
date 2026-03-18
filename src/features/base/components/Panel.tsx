// src/features/base/components/Panel.tsx
"use client";

import { X } from "lucide-react";

interface Props {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function Panel({ title, children, onClose }: Props) {
  return (
    <div className="absolute top-full left-4 z-20 mt-1 min-w-[320px] rounded-lg border border-[#e0e0e0] bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#1f1f1f]">{title}</span>
        <button onClick={onClose} className="text-[#999] hover:text-[#666]">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {children}
    </div>
  );
}
