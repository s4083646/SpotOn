import { MELBOURNE_CBD } from "../data/spots";
import type { Coordinates } from "../types/spot";
import { distanceKm } from "./spots";

export type GeolocationFailure = "unsupported" | "denied" | "unavailable";

export class GeolocationError extends Error {
  reason: GeolocationFailure;

  constructor(reason: GeolocationFailure) {
    super(reason);
    this.reason = reason;
  }
}

/** Distances beyond this from the CBD mean the user isn't in Melbourne. */
const MELBOURNE_RADIUS_KM = 60;

export const isInMelbourne = (point: Coordinates) => distanceKm(point, MELBOURNE_CBD) <= MELBOURNE_RADIUS_KM;

/** Asks the browser for the user's position. Only call this from a user action (e.g. a button tap). */
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new GeolocationError("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      (error) => reject(new GeolocationError(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable")),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  });
}

export const geolocationMessages: Record<GeolocationFailure, string> = {
  unsupported: "Your browser doesn't support location, so we're showing Melbourne CBD.",
  denied: "Location access is off, so we're showing Melbourne CBD. You can allow it in your browser settings.",
  unavailable: "We couldn't find your location right now, so we're showing Melbourne CBD.",
};
