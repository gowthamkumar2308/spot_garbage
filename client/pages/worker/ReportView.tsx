import { useApp } from "@/context/AppState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppState";

function MapEmbed({ lat, lng }: { lat: number; lng: number }) {
  const bbox = `${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  return <iframe title="map" className="w-full h-64 rounded border" src={src}></iframe>;
}

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, updateComplaintStatus, deleteComplaint, user } = useApp();
  const c = complaints.find((x) => x.id === id);

  const fallbackLat = 18.060621419165987;
  const fallbackLng = 83.4052036256904;
  const isFallback = c && Math.abs(c.lat - fallbackLat) < 0.000001 && Math.abs(c.lng - fallbackLng) < 0.000001;

  if (!c) {
    return (
      <div className="container py-8">
        <h2 className="text-2xl font-semibold">Report not found</h2>
        <div className="mt-4">
          <Link to="/worker/all-posts">
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{c.title}</h1>
          <div className="text-sm text-muted-foreground">Reported by {c.reporterName} • {new Date(c.createdAt).toLocaleString()}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
          {/* Only workers/admins can change status */}
          {user?.role === 'worker' && c.status !== 'collected' && (
            <>
              <Button variant="secondary" onClick={() => updateComplaintStatus(c.id, 'in_progress')}>In Progress</Button>
              <Button onClick={() => updateComplaintStatus(c.id, 'collected')}>Collected</Button>
            </>
          )}
          {user?.name === c.reporterName && (
            <Button className="bg-red-600 text-white" onClick={() => { if (confirm('Delete this report?')) { deleteComplaint(c.id); navigate('/my-posts'); } }}>Delete</Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-4">
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="text-sm text-muted-foreground mb-2">Description</div>
            <div>{c.description}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">{c.wasteType}</Badge>
              <Badge variant={c.toxicity === 'high' ? 'destructive' : 'secondary'}>{c.toxicity}</Badge>
              <Badge>{c.status}</Badge>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="text-sm text-muted-foreground mb-2">Location</div>
            <div className="mb-3">{c.lat.toFixed(6)}, {c.lng.toFixed(6)}</div>
            <MapEmbed lat={c.lat} lng={c.lng} />
            <div className="mt-3 flex gap-2">
              <a className="text-sm underline" href={`https://maps.google.com/?q=${c.lat},${c.lng}`} target="_blank" rel="noreferrer">Open in Google Maps</a>
              {isFallback && (
                <a className="text-sm underline" href={`https://maps.google.com/?q=${fallbackLat},${fallbackLng}`} target="_blank" rel="noreferrer">Open default location</a>
              )}
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground mb-2">Image</div>
          {c.image ? (
            <img src={c.image} alt={c.title} className="w-full rounded-md object-cover border" />
          ) : (
            <div className="h-48 w-full rounded-md bg-muted grid place-items-center text-muted-foreground">No image provided</div>
          )}
        </aside>
      </div>
    </div>
  );
}
