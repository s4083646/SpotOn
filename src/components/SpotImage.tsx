import { useState } from "react";
import type { StudySpot } from "../types/spot";
import MapCharacter from "./MapCharacter";

type LoadState = { src: string; state: "loading" | "loaded" | "error" };

/** Spot photo with a soft loading tint and an illustrated fallback if the image fails to load. */
export default function SpotImage({ spot, className }: { spot: StudySpot; className: string }) {
  const [load, setLoad] = useState<LoadState>({ src: spot.image, state: "loading" });
  // Reset when the same element is reused for a different spot (e.g. the featured card after filtering).
  const state = load.src === spot.image ? load.state : "loading";

  if (state === "error") {
    return (
      <div className={`flex items-center justify-center bg-[#ffe8b0] ${className}`} role="img" aria-label={spot.alt}>
        <MapCharacter type={spot.type} className="h-14 w-14" />
      </div>
    );
  }

  return (
    <img
      alt={spot.alt}
      className={`${className} bg-[#efe6d8] transition-opacity duration-300 ${state === "loaded" ? "opacity-100" : "opacity-0"}`}
      decoding="async"
      onError={() => setLoad({ src: spot.image, state: "error" })}
      onLoad={() => setLoad({ src: spot.image, state: "loaded" })}
      src={spot.image}
    />
  );
}
