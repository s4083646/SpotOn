import { useEffect, useId, useRef, type ReactNode } from "react";

// Stack of open sheets so Escape and focus trapping only apply to the top-most one.
const openSheets: string[] = [];

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type SheetProps = {
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
  layer?: "base" | "top";
};

/** Bottom sheet modal used for details, filters, location and login. */
export default function Sheet({ onClose, labelledBy, children, className = "", layer = "base" }: SheetProps) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    openSheets.push(id);
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const firstField = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel;
    firstField?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (openSheets[openSheets.length - 1] !== id || !panel) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      openSheets.splice(openSheets.indexOf(id), 1);
      if (!openSheets.length) document.body.style.overflow = "";
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [id]);

  return (
    <div
      className={`sheet-backdrop fixed inset-0 flex items-end justify-center bg-[#20201f]/40 px-3 backdrop-blur-[2px] ${layer === "top" ? "z-50" : "z-40"}`}
      onClick={onClose}
    >
      <div
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={`sheet-panel mb-[max(0.75rem,env(safe-area-inset-bottom))] max-h-[88dvh] w-full max-w-[406px] overflow-y-auto overscroll-contain rounded-[28px] bg-[#fffdf8] shadow-2xl outline-none ${className}`}
        onClick={(event) => event.stopPropagation()}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
