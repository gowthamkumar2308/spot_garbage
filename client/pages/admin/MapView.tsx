import { useApp } from "@/context/AppState";
import { useMemo, useState } from "react";

function OSMEmbed({ lat, lng }: { lat: number; lng: number }) {
  const bbox = `${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <iframe
      title="map"
      className="w-full h-80 rounded border"
      src={src}
    ></iframe>
  );
}

export default function AdminMapView() {
  const { complaints } = useApp();
  const [selected, setSelected] = useState(complaints[0]?.id);
  const current = useMemo(
    () => complaints.find((c) => c.id === selected) || complaints[0],
    [complaints, selected],
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-1">Map View</h1>
      <p className="text-muted-foreground mb-4">
        View complaints as markers. Click a report to focus the map.
      </p>
      {current && <OSMEmbed lat={current.lat} lng={current.lng} />}
      <ul className="grid gap-2 mt-4">
        {complaints.map((c) => (
          <li
            key={c.id}
            className={`rounded-md border p-3 cursor-pointer ${c.id === current?.id ? "bg-accent" : ""}`}
            onClick={() => setSelected(c.id)}
          >
            <div className="font-medium">{c.title}</div>
            <div className="text-sm text-muted-foreground">
              {c.wasteType} • {c.toxicity} • {c.lat.toFixed(3)},{" "}
              {c.lng.toFixed(3)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
