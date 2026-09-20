"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { BRANCHES_I18N, UI } from "@/lib/i18n";

type ClinicMapProps = {
  selectedId?: number | null;
  onSelect?: (id: number) => void;
  autoFit?: boolean;
};

type ClinicMapLocation = {
  id: number;
  lat: number;
  lng: number;
  name: string;
  address: string;
};

function getDirectionsUrl(location: Pick<ClinicMapLocation, "lat" | "lng">) {
  return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
}

function getMarkerIcon(selected: boolean, label: string) {
  const size = selected ? 38 : 32;
  const height = selected ? 38 : 32;

  return L.divIcon({
    className: "",
    html: `<span style="display:flex; align-items:center; justify-content:center; width:${size}px; height:${height}px;border-radius:50% 50% 50% 0; transform:rotate(-45deg); background:${selected ? "#C2185B" : "#E91E63"}; border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.28);">
    <span style="transform:rotate(45deg); color:#fff; font:700 13px/1 Arial,sans-serif;">${label}</span>
    </span>`,
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -height + 8],
  });
}

function MapViewport({
  locations,
  selectedId,
  autoFit,
}: {
  locations: ClinicMapLocation[];
  selectedId: number | null;
  autoFit: boolean;
}) {
  const map = useMap();
  const bounds = useMemo(
    () => L.latLngBounds(locations.map((location) => [location.lat, location.lng])),
    [locations],
  );

  useEffect(() => {
    if (autoFit) {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 13 });
    }
  }, [autoFit, bounds, map]);

  useEffect(() => {
    const location = locations.find((candidate) => candidate.id === selectedId);
    if (!location) return;

    map.flyTo([location.lat, location.lng], Math.max(map.getZoom(), 14), {
      duration: 0.55,
    });
  }, [locations, map, selectedId]);

  return null;
}

export default function ClinicMap({
  selectedId,
  onSelect,
  autoFit = true,
}: ClinicMapProps) {
  const { locale } = useLocale();
  const t = UI[locale];
  const [internalSelectedId, setInternalSelectedId] = useState<number | null>(null);
  const locations = useMemo<ClinicMapLocation[]>(
    () =>
      CLINIC.locations.map((location) => {
        const branch = BRANCHES_I18N.find((candidate) => candidate.id === location.id);
        return {
          ...location,
          name: branch?.[locale].name ?? "",
          address: branch?.[locale].address ?? "",
        };
      }),
    [locale],
  );
  const resolvedSelectedId = selectedId ?? internalSelectedId;
  const initialLocation = locations[0] ?? { lat: 30, lng: 31 };

  const handleSelect = useCallback(
    (id: number) => {
      setInternalSelectedId(id);
      onSelect?.(id);
    },
    [onSelect],
  );

  return (
    <div className="w-full">
      <MapContainer
        center={[initialLocation.lat, initialLocation.lng]}
        zoom={11}
        scrollWheelZoom
        className="h-[360px] z-0 w-full rounded-2xl border border-[#E91E63]/20 shadow-md"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport
          locations={locations}
          selectedId={resolvedSelectedId}
          autoFit={autoFit}
        />
        {locations.map((location) => {
          const isSelected = location.id === resolvedSelectedId;
          return (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={getMarkerIcon(isSelected, String(location.id))}
              title={location.name}
              alt={location.name}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{
                click: () => handleSelect(location.id),
              }}
            >
              {isSelected && (
                <Popup minWidth={240} maxWidth={320} autoPan>
                  <div className="min-w-[220px]">
                    <h3 className="mb-1 text-sm font-bold text-[#2d1a1a]">
                      {location.name}
                    </h3>
                    <p className="mb-3 text-xs leading-relaxed text-[#6b7280]">
                      {location.address}
                    </p>
                    <a
                      href={getDirectionsUrl(location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.directions}: ${location.name}`}
                      className="inline-flex text-decoration-none text-white items-center gap-1.5 rounded-lg bg-[#E91E63] px-3 py-2 text-xs font-semibold transition-colors"
                    >
                      {t.directions}
                    </a>
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
