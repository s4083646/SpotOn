import type { SpotType } from "../types/spot";

/** Illustrated map pin: a coffee cup for cafés, an open book for libraries (blue for campus libraries). */
export default function MapCharacter({ type, className = "h-16 w-16" }: { type: SpotType; className?: string }) {
  if (type === "Café") {
    return (
      <svg aria-hidden="true" className={`${className} drop-shadow-[0_5px_4px_rgba(55,39,29,0.22)]`} viewBox="0 0 64 64">
        <path d="M18 18h31l-3 27c-.5 5-4.7 9-9.8 9h-6.4c-5.1 0-9.3-4-9.8-9l-2-27Z" fill="#FFB58F" stroke="#20201F" strokeLinejoin="round" strokeWidth="2.5" />
        <path d="M19 19c0-3 6.5-5.5 14.5-5.5S48 16 48 19s-6.5 5.5-14.5 5.5S19 22 19 19Z" fill="#FFFDF8" stroke="#20201F" strokeWidth="2.5" />
        <path d="M23 18.8c1.8-1.5 5.7-2.5 10.5-2.5s8.7 1 10.5 2.5c-1.8 1.5-5.7 2.5-10.5 2.5s-8.7-1-10.5-2.5Z" fill="#9A5C3E" />
        <path d="M48 27h2a7 7 0 0 1 0 14h-3.5" fill="none" stroke="#20201F" strokeWidth="2.5" />
        <circle cx="29" cy="33" r="1.7" fill="#20201F" />
        <circle cx="39" cy="33" r="1.7" fill="#20201F" />
        <path d="M31 39c1.8 1.5 4.2 1.5 6 0M20 32l-6-3m34 4 6-2M28 54l-3 6m13-6 3 6" fill="none" stroke="#20201F" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    );
  }

  const alternate = type === "Campus";
  return (
    <svg aria-hidden="true" className={`${className} drop-shadow-[0_5px_4px_rgba(55,39,29,0.22)]`} viewBox="0 0 64 64">
      <path d="M10 17c8-3 15-2 22 3v34c-6-4-13-5-22-2V17Z" fill={alternate ? "#AFC5F1" : "#F8D66D"} stroke="#20201F" strokeLinejoin="round" strokeWidth="2.5" />
      <path d="M54 17c-8-3-15-2-22 3v34c6-4 13-5 22-2V17Z" fill={alternate ? "#C8D7F4" : "#FFE8A4"} stroke="#20201F" strokeLinejoin="round" strokeWidth="2.5" />
      <path d="M16 26c4-.8 7-.2 10 1.5M38 27.5c3-1.7 6-2.3 10-1.5" fill="none" stroke="#20201F" strokeLinecap="round" strokeWidth="2" />
      <circle cx="24" cy="36" r="1.7" fill="#20201F" />
      <circle cx="40" cy="36" r="1.7" fill="#20201F" />
      <path d="M28 41c2.5 2 5.5 2 8 0M11 37l-6 3m48-3 6 3M21 53l-2 7m24-7 2 7" fill="none" stroke="#20201F" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}
