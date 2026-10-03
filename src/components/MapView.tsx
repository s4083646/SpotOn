import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { AttributionControl, MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import type { Coordinates, SpotType, SpotWithStatus } from "../types/spot";
import Icon from "./Icon";

export type MapViewState = { center: Coordinates; zoom: number };
/** A request to move the map. `key` changes for every request so repeated requests still animate. */
export type MapFocus = { center: Coordinates; zoom: number; key: number };

type MapViewProps = {
  spots: SpotWithStatus[];
  selectedId: number | null;
  userPosition: Coordinates | null;
  initialView: MapViewState;
  focus: MapFocus | null;
  locating: boolean;
  onSelect: (spotId: number | null) => void;
  onViewChange: (view: MapViewState, visibleSpotIds: number[]) => void;
  onLocate: () => void;
};

const toLatLng = (point: Coordinates): L.LatLngTuple => [point.latitude, point.longitude];

// Small inline SVG glyphs for the pins (Leaflet markers are plain HTML, not React).
const glyphs: Record<SpotType, string> = {
  Library: '<path d="M4 5.5c3-1.2 5.6-.8 8 1v13c-2.4-1.6-5-2-8-1v-13Z"/><path d="M20 5.5c-3-1.2-5.6-.8-8 1v13c2.4-1.6 5-2 8-1v-13Z"/>',
  Café: '<path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/>',
  Campus: '<path d="m2.5 9 9.5-4.5L21.5 9 12 13.5 2.5 9Z"/><path d="M6.5 11v4.5c3.3 2.4 7.7 2.4 11 0V11M21.5 9v5"/>',
};

const iconCache = new Map<string, L.DivIcon>();

/** Branded HTML pin: type glyph + rating, highlighted and labelled when selected. */
function spotIcon(spot: SpotWithStatus, selected: boolean): L.DivIcon {
  const key = `${spot.id}-${selected}-${spot.isOpen}`;
  const cached = iconCache.get(key);
  if (cached) return cached;

  const typeClass = spot.type === "Café" ? "cafe" : spot.type.toLowerCase();
  const name = spot.name.replace(/[&<>"]/g, "");
  const icon = L.divIcon({
    className: "spot-pin-anchor",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div class="spot-pin spot-pin--${typeClass}${selected ? " is-selected" : ""}${spot.isOpen ? "" : " is-closed"}">
      <span class="spot-pin__glyph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyphs[spot.type]}</svg></span>
      <span class="spot-pin__text">${selected ? `<span class="spot-pin__name">${name}</span>` : ""}<span>★ ${spot.rating.toFixed(1)}</span></span>
    </div>`,
  });
  iconCache.set(key, icon);
  return icon;
}

const userIcon = L.divIcon({ className: "spot-pin-anchor", iconSize: [0, 0], iconAnchor: [0, 0], html: '<div class="user-dot"><span></span></div>' });

/** Reports view changes and handles background clicks and focus requests. */
function MapEvents({ spots, focus, onSelect, onViewChange }: Pick<MapViewProps, "spots" | "focus" | "onSelect" | "onViewChange">) {
  const latest = useRef({ spots, onViewChange });
  latest.current = { spots, onViewChange };

  const map = useMapEvents({
    click: () => onSelect(null),
    moveend: () => report(),
  });

  const report = () => {
    const bounds = map.getBounds();
    const center = map.getCenter();
    const visible = latest.current.spots.filter((spot) => bounds.contains(toLatLng(spot))).map((spot) => spot.id);
    latest.current.onViewChange({ center: { latitude: center.lat, longitude: center.lng }, zoom: map.getZoom() }, visible);
  };

  // Re-count visible spots whenever the filtered list changes.
  useEffect(() => {
    report();
  }, [spots]);

  // A focus request that existed before this map mounted is already reflected in the initial view,
  // so only animate for requests made while the map is on screen.
  const handledFocusKey = useRef(focus?.key);
  useEffect(() => {
    if (!focus || focus.key === handledFocusKey.current) return;
    handledFocusKey.current = focus.key;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.flyTo(toLatLng(focus.center), focus.zoom, { animate: !reduceMotion, duration: 0.8 });
  }, [focus, map]);

  return null;
}

export default function MapView({ spots, selectedId, userPosition, initialView, focus, locating, onSelect, onViewChange, onLocate }: MapViewProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  // Only use the initial view on first mount; later moves come through `focus`.
  const [startView] = useState(initialView);

  const markers = useMemo(
    () =>
      spots.map((spot) => (
        <Marker
          alt={spot.name}
          eventHandlers={{
            // Marker clicks don't bubble to the map, so this won't also trigger the background "deselect" click.
            click: () => onSelect(spot.id),
          }}
          icon={spotIcon(spot, spot.id === selectedId)}
          key={spot.id}
          keyboard
          position={toLatLng(spot)}
          title={spot.name}
          zIndexOffset={spot.id === selectedId ? 1000 : 0}
        />
      )),
    [spots, selectedId, onSelect],
  );

  const controlButton =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#20201f] shadow-[0_6px_18px_rgba(32,32,31,0.16)] transition hover:bg-[#fff8ec] active:scale-95 disabled:cursor-wait";

  return (
    <div className="absolute inset-0 isolate">
      <MapContainer
        attributionControl={false}
        center={toLatLng(startView.center)}
        className="h-full w-full"
        ref={setMap}
        zoom={startView.zoom}
        zoomControl={false}
        minZoom={11}
        maxZoom={19}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AttributionControl position="topleft" prefix={false} />
        <MapEvents focus={focus} onSelect={onSelect} onViewChange={onViewChange} spots={spots} />
        {markers}
        {userPosition && <Marker icon={userIcon} interactive={false} position={toLatLng(userPosition)} zIndexOffset={-100} />}
      </MapContainer>

      <div className="absolute right-3 top-[118px] z-[1000] flex flex-col gap-2">
        <button aria-label="Show my location" className={`${controlButton} text-[#ff7048]`} disabled={locating} onClick={onLocate} type="button">
          {locating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#ff7048]/30 border-t-[#ff7048]" /> : <Icon name="crosshair" className="h-5 w-5" />}
        </button>
        <div className="flex flex-col overflow-hidden rounded-full bg-white shadow-[0_6px_18px_rgba(32,32,31,0.16)]">
          <button aria-label="Zoom in" className="flex h-11 w-11 items-center justify-center text-[20px] font-bold text-[#20201f] transition hover:bg-[#fff8ec] active:bg-[#fff1c6]" onClick={() => map?.zoomIn()} type="button">+</button>
          <span className="mx-2.5 h-px bg-[#20201f]/10" />
          <button aria-label="Zoom out" className="flex h-11 w-11 items-center justify-center text-[20px] font-bold text-[#20201f] transition hover:bg-[#fff8ec] active:bg-[#fff1c6]" onClick={() => map?.zoomOut()} type="button">−</button>
        </div>
      </div>
    </div>
  );
}
