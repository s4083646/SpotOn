import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

type EmptyStateProps = {
  icon: IconName;
  title: string;
  message: string;
  action?: ReactNode;
};

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="rounded-[26px] border border-dashed border-[#20201f]/15 bg-white/60 px-8 py-12 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe6a7] text-[#ff7048]">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-[17px] font-extrabold text-[#20201f]">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-[260px] text-[12px] leading-5 text-[#7b7481]">{message}</p>
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
