import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

  useEffect(() => {
    setCenter([lat, lng]);
  }, [lat, lng]);

  return (
    <div className="w-full h-64 rounded overflow-hidden border">
      <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onSelect={(a, b) => {
          onSelect(a, b);
          setCenter([a, b]);
        }} />
        {/* show small circle at center */}
        <Circle center={center} radius={6} pathOptions={{ color: "red" }} />
      </MapContainer>
    </div>
  );
}
