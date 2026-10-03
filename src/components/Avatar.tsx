import type { User } from "../types/user";
import { getInitials } from "../utils/user";

const sizes = {
  sm: "h-10 w-10 text-[13px]",
  lg: "h-14 w-14 text-[18px]",
};

export default function Avatar({ user, size = "lg" }: { user: User; size?: keyof typeof sizes }) {
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full bg-[#f8d66d] font-extrabold tracking-[-0.02em] text-[#20201f] ${sizes[size]}`}>
      {getInitials(user)}
    </span>
  );
}
