import { Panel } from "./Panel";
import type { FieldSummary } from "~/types";


interface HidePanelProps {
  fields:         FieldSummary[];
  hiddenFieldIds: string[];
  onChange:       (ids: string[]) => void;
  onClose:        () => void;
}

export function HideFieldsPanel({ fields, hiddenFieldIds, onChange, onClose }: HidePanelProps) {
  const toggle = (id: string) => {
    onChange(
      hiddenFieldIds.includes(id)
        ? hiddenFieldIds.filter((f) => f !== id)
        : [...hiddenFieldIds, id],
    );
  };

  return (
    <Panel title="Hide fields" onClose={onClose}>
      <div className="space-y-1">
        {fields.map((field) => {
          const hidden = hiddenFieldIds.includes(field.id);
          return (
            <label key={field.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={!hidden}
                onChange={() => toggle(field.id)}
                className="accent-[#1170cb]"
              />
              <span className="text-xs text-[#1f1f1f]">{field.name}</span>
              <span className="text-[10px] text-[#999]">{field.type}</span>
            </label>
          );
        })}
      </div>
    </Panel>
  );
}