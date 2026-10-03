import { useCallback, useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "./Icon";

/** `badge` shows short text (e.g. "XP") in place of the icon. */
export type ToastMessage = { id: number; text: string; icon: IconName; badge?: string };

/** Small confirmation messages ("Saved to your spots", "Logged out"). */
export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const showToast = useCallback((text: string, icon: IconName = "check", badge?: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), text, icon, badge });
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { toast, showToast };
}

export default function Toast({ toast }: { toast: ToastMessage | null }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-[60] flex justify-center px-4">
      {toast && (
        <div className="toast-in flex items-center gap-2 rounded-full bg-[#20201f] py-2.5 pl-3 pr-4 text-[12px] font-bold text-white shadow-[0_12px_30px_rgba(32,32,31,0.28)]" key={toast.id} role="status">
          <span className={`flex items-center justify-center rounded-full bg-[#f8d66d] text-[#20201f] ${toast.badge ? "h-6 w-6 text-[9px] font-extrabold" : "h-5 w-5"}`}>
            {toast.badge ?? <Icon name={toast.icon} className="h-3 w-3" filled={toast.icon === "heart"} />}
          </span>
          {toast.text}
        </div>
      )}
    </div>
  );
}
