import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Circle, Marker } from "react-leaflet";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ClickHandler({ onSelect, interactive }: { onSelect: (lat: number, lng: number) => void; interactive: boolean }) {
  useMapEvents({
    click(e) {
      if (!interactive) return;
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({
  lat,
  lng,
  onSelect,
  interactive = true,
}: {
  lat: number;
  lng: number;
  onSelect: (lat: number, lng: number) => void;
  interactive?: boolean;
}) {
  const [center, setCenter] = useState<[number, number]>([lat, lng]);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    setCenter([lat, lng]);
    if (map && typeof map.setView === "function") {
      try {
        map.setView([lat, lng]);
        // sometimes need to invalidate size for correct rendering
        setTimeout(() => map.invalidateSize && map.invalidateSize(), 50);
      } catch (e) {
        // ignore
      }
    }
  }, [lat, lng, map]);

  useEffect(() => {
    if (!map) return;
    const handler = () => map.invalidateSize && map.invalidateSize();
    window.addEventListener("resize", handler);
    // also call once to ensure correct layout
    setTimeout(handler, 100);
    return () => window.removeEventListener("resize", handler);
  }, [map]);

  return (
    <div className="w-full h-64 rounded overflow-hidden border">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(m) => setMap(m)}
        dragging={interactive}
        doubleClickZoom={interactive}
        zoomControl={true}
        scrollWheelZoom={interactive}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler
          interactive={interactive}
          onSelect={(a, b) => {
            onSelect(a, b);
            setCenter([a, b]);
          }}
        />
        {/* show marker at center; draggable when interactive */}
        <Marker
          position={center}
          icon={markerIcon}
          draggable={interactive}
          eventHandlers={{
            dragend: (e: any) => {
              const p = e.target.getLatLng();
              onSelect(p.lat, p.lng);
              setCenter([p.lat, p.lng]);
            },
          }}
        />
        {/* small visual circle for clarity */}
        <Circle center={center} radius={6} pathOptions={{ color: "red" }} />
      </MapContainer>
    </div>
  );
}
