import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Circle } from "react-leaflet";

function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({
  lat,
  lng,
  onSelect,
}: {
  lat: number;
  lng: number;
  onSelect: (lat: number, lng: number) => void;
}) {
  const [center, setCenter] = useState<[number, number]>([lat, lng]);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    setCenter([lat, lng]);
    if (map && typeof map.setView === "function") {
      try {
        map.setView([lat, lng]);
        // sometimes need to invalidate size for correct rendering
        setTimeout(() => map.invalidateSize && map.invalidateSize(), 0);
      } catch (e) {
        // ignore
      }
    }
  }, [lat, lng, map]);

  return (
    <div className="w-full h-64 rounded overflow-hidden border">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(m) => setMap(m)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler
          onSelect={(a, b) => {
            onSelect(a, b);
            setCenter([a, b]);
          }}
        />
        {/* show small circle at center */}
        <Circle center={center} radius={6} pathOptions={{ color: "red" }} />
      </MapContainer>
    </div>
  );
}
