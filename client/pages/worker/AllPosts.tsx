import { useApp } from "@/context/AppState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function WorkerAllPosts() {
  const { complaints, updateComplaintStatus } = useApp();
  return (
    <div className="container py-8">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Track and update complaints across the city.</p>
        </div>
      </div>
      <ul className="grid gap-4">
        {complaints.map((c) => (
          <li key={c.id} className="rounded-2xl border p-4 grid gap-3 md:grid-cols-[1fr_auto] items-center bg-card shadow-sm">
            <div>
              <h3 className="font-semibold">{c.title} <span className="text-xs text-muted-foreground">({c.lat.toFixed(3)}, {c.lng.toFixed(3)})</span></h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{c.wasteType}</Badge>
                <Badge variant={c.toxicity === 'high' ? 'destructive' : 'secondary'}>{c.toxicity}</Badge>
                <Badge>{c.status}</Badge>
                <a className="text-sm underline" href={`https://maps.google.com/?q=${c.lat},${c.lng}`} target="_blank" rel="noreferrer">Open in Maps</a>
              </div>
            </div>
            {c.status !== 'collected' && (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => updateComplaintStatus(c.id, 'in_progress')}>In Progress</Button>
                <Button onClick={() => updateComplaintStatus(c.id, 'collected')}>Collected</Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
