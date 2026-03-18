import { useEffect, type RefObject } from "react";

/**
 * Fires `onClose` when a mousedown event occurs outside the referenced element.
 * Set `enabled` to false to skip attaching the listener (e.g., when the menu is closed).
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose, enabled]);
}
