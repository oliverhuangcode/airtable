"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "~/trpc/react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  QuestionIcon,
  ChevronRightIcon,
} from "~/components/icons/AirtableIcons";

interface Props {
  tableId: string;
}

interface FieldOption {
  label: string;
  icon: React.ReactNode;
  type?: "TEXT" | "NUMBER";
  disabled?: boolean;
}

// ── Icons matching Airtable's field type picker ──────────────────────────────

const LinkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <path
      d="M3 5h3M3 8h3M3 11h3M10 5h3M10 8h3M10 11h3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const SingleLineTextIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <text
      x="3"
      y="12.5"
      fontSize="13"
      fontWeight="700"
      fill="currentColor"
      fontFamily="serif"
    >
      A
    </text>
  </svg>
);

const LongTextIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <path
      d="M3 4h10M3 7h7M3 10h9M3 13h5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const AttachmentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <rect
      x="4"
      y="2"
      width="8"
      height="12"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M6 6h4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const CheckboxIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <rect
      x="3"
      y="3"
      width="10"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M5.5 8l2 2 3-4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MultipleSelectIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <rect
      x="2"
      y="4"
      width="5"
      height="3"
      rx="1"
      stroke="currentColor"
      strokeWidth="1"
    />
    <rect
      x="8"
      y="4"
      width="6"
      height="3"
      rx="1"
      stroke="currentColor"
      strokeWidth="1"
    />
    <rect
      x="2"
      y="9"
      width="7"
      height="3"
      rx="1"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

const SingleSelectIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M5.5 8l1.5 1.5 3-3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M3 14c0-2.76 2.24-5 5-5s5 2.24 5 5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const DateIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <rect
      x="2"
      y="3"
      width="12"
      height="11"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.3" />
    <text
      x="5"
      y="12.5"
      fontSize="7"
      fontWeight="600"
      fill="currentColor"
      fontFamily="sans-serif"
    >
      31
    </text>
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <path
      d="M3.5 2C3.5 2 5 2 5.5 4S5 7 4.5 7.5 6 10 8.5 11.5s2.5-.5 3.5 0 2 1.5 2 1.5-1 2.5-4 1S2 6 2.5 3.5 3.5 2 3.5 2z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <rect
      x="2"
      y="3.5"
      width="12"
      height="9"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M2 4.5l6 4 6-4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UrlIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <path
      d="M6.5 9.5l3-3M5 10.5a2.5 2.5 0 010-3.5l1-1M8 5l1-1a2.5 2.5 0 013.5 3.5l-1 1"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const NumberIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
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

const CurrencyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <text
      x="3"
      y="13"
      fontSize="13"
      fontWeight="600"
      fill="currentColor"
      fontFamily="sans-serif"
    >
      $
    </text>
  </svg>
);

const PercentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <text
      x="1"
      y="13"
      fontSize="12"
      fontWeight="600"
      fill="currentColor"
      fontFamily="sans-serif"
    >
      %
    </text>
  </svg>
);

const DurationIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M8 5v3.5l2.5 1.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RatingIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <path
      d="M8 2l1.8 3.6 4 .6-2.9 2.8.7 4L8 11.2 4.4 13l.7-4L2.2 6.2l4-.6L8 2z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const FormulaIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <text
      x="2"
      y="12.5"
      fontSize="11"
      fontWeight="600"
      fontStyle="italic"
      fill="currentColor"
      fontFamily="serif"
    >
      fx
    </text>
  </svg>
);

// ── Field agent icons ────────────────────────────────────────────────────────

const AnalyzeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#666]"
  >
    <rect
      x="4"
      y="2"
      width="8"
      height="12"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M6 6h4M6 9h2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const ResearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#2d7ff9]"
  >
    <rect
      x="2"
      y="2"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="9"
      y="2"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="2"
      y="9"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="9"
      y="9"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
);

const FindImageIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#20a87e]"
  >
    <rect
      x="2"
      y="3"
      width="12"
      height="10"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <circle cx="5.5" cy="6" r="1.5" stroke="currentColor" strokeWidth="1" />
    <path
      d="M2 11l3-3 2 2 3-4 4 5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const GenerateImageIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#2d7ff9]"
  >
    <rect
      x="2"
      y="3"
      width="12"
      height="10"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M6 8h4M8 6v4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const DeepMatchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#20a87e]"
  >
    <path
      d="M3 5h3M3 8h3M3 11h3M10 5h3M10 8h3M10 11h3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const PrototypeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#9b59b6]"
  >
    <path
      d="M2 4l6-2 6 2v5l-6 5-6-5V4z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const CustomAgentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#20a87e]"
  >
    <rect
      x="4"
      y="3"
      width="8"
      height="8"
      rx="4"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <circle cx="6.5" cy="7" r="0.8" fill="currentColor" />
    <circle cx="9.5" cy="7" r="0.8" fill="currentColor" />
    <path
      d="M5 13h6"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const CatalogIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[#2d7ff9]"
  >
    <rect
      x="2"
      y="2"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="9"
      y="2"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="2"
      y="9"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="9"
      y="9"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
);

const FIELD_AGENTS: FieldOption[] = [
  { label: "Analyze attachment", icon: <AnalyzeIcon />, disabled: true },
  { label: "Research companies", icon: <ResearchIcon />, disabled: true },
  { label: "Find image from web", icon: <FindImageIcon />, disabled: true },
  { label: "Generate image", icon: <GenerateImageIcon />, disabled: true },
  { label: "Deep match", icon: <DeepMatchIcon />, disabled: true },
  { label: "Build prototype", icon: <PrototypeIcon />, disabled: true },
  { label: "Create custom agent", icon: <CustomAgentIcon />, disabled: true },
  { label: "Browse catalog", icon: <CatalogIcon />, disabled: true },
];

const STANDARD_FIELDS: (FieldOption & { hasArrow?: boolean })[] = [
  {
    label: "Link to another record",
    icon: <LinkIcon />,
    disabled: true,
    hasArrow: true,
  },
  { label: "Single line text", icon: <SingleLineTextIcon />, type: "TEXT" },
  { label: "Long text", icon: <LongTextIcon />, type: "TEXT" },
  { label: "Attachment", icon: <AttachmentIcon />, disabled: true },
  { label: "Checkbox", icon: <CheckboxIcon />, disabled: true },
  { label: "Multiple select", icon: <MultipleSelectIcon />, disabled: true },
  { label: "Single select", icon: <SingleSelectIcon />, disabled: true },
  { label: "User", icon: <UserIcon />, disabled: true },
  { label: "Date", icon: <DateIcon />, disabled: true },
  { label: "Phone number", icon: <PhoneIcon />, disabled: true },
  { label: "Email", icon: <EmailIcon />, disabled: true },
  { label: "URL", icon: <UrlIcon />, disabled: true },
  { label: "Number", icon: <NumberIcon />, type: "NUMBER" },
  { label: "Currency", icon: <CurrencyIcon />, disabled: true },
  { label: "Percent", icon: <PercentIcon />, disabled: true },
  { label: "Duration", icon: <DurationIcon />, disabled: true },
  { label: "Rating", icon: <RatingIcon />, disabled: true },
  { label: "Formula", icon: <FormulaIcon />, disabled: true },
];

export function AddColumnButton({ tableId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState<"picker" | "configure">("picker");
  const [selectedType, setSelectedType] = useState<FieldOption | null>(null);
  const [fieldName, setFieldName] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const utils = api.useUtils();

  const createField = api.field.create.useMutation({
    onSuccess: () => {
      void utils.base.getById.invalidate();
      setSearchQuery("");
      setIsOpen(false);
      setStep("picker");
      setSelectedType(null);
      setFieldName("");
    },
  });

  const closeAll = () => {
    setIsOpen(false);
    setSearchQuery("");
    setStep("picker");
    setSelectedType(null);
    setFieldName("");
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (option: FieldOption) => {
    if (option.disabled || !option.type) return;
    setSelectedType(option);
    setFieldName(option.label);
    setStep("configure");
  };

  const handleCreate = () => {
    if (!selectedType?.type) return;
    const name = fieldName.trim() || selectedType.label;
    createField.mutate({ tableId, name, type: selectedType.type });
  };

  const query = searchQuery.toLowerCase().trim();
  const filteredAgents = query
    ? FIELD_AGENTS.filter((f) => f.label.toLowerCase().includes(query))
    : FIELD_AGENTS;
  const filteredStandard = query
    ? STANDARD_FIELDS.filter((f) => f.label.toLowerCase().includes(query))
    : STANDARD_FIELDS;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-8 w-[92px] shrink-0 items-center justify-center bg-white text-[#999] transition-colors hover:bg-[#f5f5f5] hover:text-[#1f1f1f]"
      >
        <PlusIcon size={14} />
      </button>
    );
  }

  return (
    <>
      <button className="flex h-8 w-[92px] shrink-0 items-center justify-center bg-[#e8e8e8] text-[#1f1f1f]">
        <PlusIcon size={14} />
      </button>

      <div
        ref={panelRef}
        className="absolute top-full right-0 z-30 mt-0.5 w-[420px] rounded-lg border border-[#ddd] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "configure" && selectedType ? (
          // ── Configure panel ───────────────────────────────────────────────
          <div className="flex flex-col gap-2 p-3">
            <input
              autoFocus
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Field name (optional)"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") closeAll();
              }}
              className="w-full rounded-md border border-[#1170cb] px-3 py-2 text-[13px] text-[#1d1f25] outline-none placeholder:text-[#999]"
            />
            <div className="flex items-center gap-2 rounded-md border border-[#ddd] px-3 py-2 text-[13px] text-[#1d1f25]">
              <span className="flex-shrink-0">{selectedType.icon}</span>
              <span className="flex-1">{selectedType.label}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 text-[#999]">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={closeAll}
                className="rounded px-3 py-1.5 text-[13px] text-[#555] transition-colors hover:bg-[#f5f5f5]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createField.isPending}
                className="rounded bg-[#1d7ff6] px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1a72dd] disabled:opacity-60"
              >
                {createField.isPending ? "Creating..." : "Create field"}
              </button>
            </div>
          </div>
        ) : (
          // ── Type picker panel ─────────────────────────────────────────────
          <>
            <div className="flex items-center gap-2 border-b border-[#eee] px-3 py-2.5">
              <MagnifyingGlassIcon size={16} className="flex-shrink-0 text-[#999]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeAll();
                }}
                placeholder="Find a field type"
                className="flex-1 bg-transparent text-[13px] text-[#1d1f25] outline-none placeholder:text-[#999]"
              />
              <button className="flex-shrink-0 text-[#999] hover:text-[#666]">
                <QuestionIcon size={16} />
              </button>
            </div>

            <div className="max-h-[480px] overflow-y-auto">
              {filteredAgents.length > 0 && (
                <div className="px-3 pt-3 pb-1">
                  <p className="mb-2 text-[11px] font-medium tracking-wide text-[#999] uppercase">
                    Field agents
                  </p>
                  <div className="grid grid-cols-2 gap-0.5">
                    {filteredAgents.map((agent) => (
                      <button
                        key={agent.label}
                        onClick={() => handleSelect(agent)}
                        className="flex items-center gap-2 rounded-md px-2 py-[7px] text-left text-[13px] text-[#1d1f25] transition-colors hover:bg-[#f5f5f5] disabled:opacity-50"
                        disabled={agent.disabled}
                      >
                        <span className="flex-shrink-0">{agent.icon}</span>
                        <span className="truncate">{agent.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredStandard.length > 0 && (
                <div className="px-3 pt-3 pb-2">
                  <p className="mb-1 text-[11px] font-medium tracking-wide text-[#999] uppercase">
                    Standard fields
                  </p>
                  <div className="flex flex-col">
                    {filteredStandard.map((field) => (
                      <button
                        key={field.label}
                        onClick={() => handleSelect(field)}
                        className={`flex items-center gap-2.5 rounded-md px-2 py-[7px] text-left text-[13px] transition-colors ${
                          field.disabled
                            ? "text-[#1d1f25] opacity-50 hover:bg-[#f5f5f5]"
                            : "text-[#1d1f25] hover:bg-[#f0f3ff]"
                        }`}
                        disabled={field.disabled}
                      >
                        <span className="flex-shrink-0">{field.icon}</span>
                        <span className="flex-1 truncate">{field.label}</span>
                        {field.hasArrow && (
                          <ChevronRightIcon size={14} className="flex-shrink-0 text-[#999]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredAgents.length === 0 && filteredStandard.length === 0 && (
                <div className="px-3 py-6 text-center text-[13px] text-[#999]">
                  No matching field types
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
