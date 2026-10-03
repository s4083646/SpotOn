/** The user's Study Buddy character, wearing any equipped cosmetics. */
export default function StudyBuddy({ equipped = [], className = "h-32 w-32" }: { equipped?: string[]; className?: string }) {
  const has = (item: string) => equipped.includes(item);

  return (
    <svg aria-label="Your Study Buddy character" className={`${className} buddy-float drop-shadow-[0_9px_8px_rgba(66,50,40,0.18)]`} role="img" viewBox="0 0 140 150">
      <path d="M35 125c-8 3-15 8-18 15M105 125c8 3 15 8 18 15" fill="none" stroke="#20201f" strokeLinecap="round" strokeWidth="5" />
      <path d="M39 135c-3 4-4 8-3 12M101 135c3 4 4 8 3 12" fill="none" stroke="#20201f" strokeLinecap="round" strokeWidth="5" />
      <path d="M27 72c0-31 18-51 43-51s43 20 43 51v36c0 20-17 32-43 32s-43-12-43-32V72Z" fill="#f8d66d" stroke="#20201f" strokeWidth="5" />
      <path d="M34 73c8-7 18-10 36-10s28 3 36 10" fill="none" stroke="#ffe8a4" strokeLinecap="round" strokeWidth="8" />
      <circle cx="54" cy="88" r="4" fill="#20201f" />
      <circle cx="86" cy="88" r="4" fill="#20201f" />
      <path d="M61 105c5 5 13 5 18 0" fill="none" stroke="#20201f" strokeLinecap="round" strokeWidth="4" />
      <circle cx="43" cy="101" r="7" fill="#ff9f86" opacity=".55" />
      <circle cx="97" cy="101" r="7" fill="#ff9f86" opacity=".55" />
      <path d="M28 91 12 82M112 91l16-9" fill="none" stroke="#20201f" strokeLinecap="round" strokeWidth="5" />
      {has("beanie") && (
        <>
          <path d="M35 44c4-25 17-36 35-36s31 11 35 36c-19-7-51-7-70 0Z" fill="#ffb58f" stroke="#20201f" strokeLinejoin="round" strokeWidth="5" />
          <path d="M34 43c18-7 54-7 72 0v14c-20-6-52-6-72 0V43Z" fill="#ff8f6c" stroke="#20201f" strokeLinejoin="round" strokeWidth="5" />
          <circle cx="70" cy="8" r="7" fill="#f6b9d4" stroke="#20201f" strokeWidth="4" />
        </>
      )}
      {has("glasses") && (
        <>
          <rect height="20" rx="8" stroke="#42649c" strokeWidth="5" width="31" x="36" y="78" fill="#dce7fa" fillOpacity=".65" />
          <rect height="20" rx="8" stroke="#42649c" strokeWidth="5" width="31" x="73" y="78" fill="#dce7fa" fillOpacity=".65" />
          <path d="M67 86h6" stroke="#42649c" strokeWidth="5" />
        </>
      )}
      {has("scarf") && (
        <>
          <path d="M39 119c18 8 44 8 62 0l-3 15c-16 7-40 7-56 0l-3-15Z" fill="#f6b9d4" stroke="#20201f" strokeLinejoin="round" strokeWidth="4" />
          <path d="M88 131v16l13-5-3-14" fill="#e98bb6" stroke="#20201f" strokeLinejoin="round" strokeWidth="4" />
        </>
      )}
    </svg>
  );
}

/** Small icon of a cosmetic for the wardrobe list. */
export function CosmeticPreview({ id }: { id: string }) {
  if (id === "beanie") {
    return (
      <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 40 40">
        <path d="M8 24c1-13 5-19 12-19s11 6 12 19c-7-3-17-3-24 0Z" fill="#ffb58f" stroke="#20201f" strokeLinejoin="round" strokeWidth="2.5" />
        <path d="M7 24c7-3 19-3 26 0v8c-7-2-19-2-26 0v-8Z" fill="#ff8f6c" stroke="#20201f" strokeLinejoin="round" strokeWidth="2.5" />
        <circle cx="20" cy="5" r="3.5" fill="#f6b9d4" stroke="#20201f" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "glasses") {
    return (
      <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 40 40">
        <rect height="15" rx="6" stroke="#42649c" strokeWidth="3" width="15" x="3" y="13" fill="#dce7fa" />
        <rect height="15" rx="6" stroke="#42649c" strokeWidth="3" width="15" x="22" y="13" fill="#dce7fa" />
        <path d="M18 19h4" stroke="#42649c" strokeWidth="3" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 40 40">
      <path d="M7 10c8 4 18 4 26 0l-2 10c-7 4-15 4-22 0L7 10Z" fill="#f6b9d4" stroke="#20201f" strokeLinejoin="round" strokeWidth="2.5" />
      <path d="M25 20v16l9-4-3-14" fill="#e98bb6" stroke="#20201f" strokeLinejoin="round" strokeWidth="2.5" />
    </svg>
  );
}
