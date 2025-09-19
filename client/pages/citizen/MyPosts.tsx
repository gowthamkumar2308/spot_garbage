import { useApp } from "@/context/AppState";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";

export default function MyPosts() {
  const { user, complaints } = useApp();
  const [wasteType, setWasteType] = useState<string>("all");
  const [tox, setTox] = useState<string>("all");

  const mine = useMemo(() => complaints.filter((c) => c.reporterName === user?.name), [complaints, user]);
  const filtered = useMemo(() => mine.filter((c) => (wasteType === "all" || c.wasteType === wasteType) && (tox === "all" || c.toxicity === tox)), [mine, wasteType, tox]);

  return (
    <div className="container py-8">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold">My Posts</h1>
          <p className="text-muted-foreground">Your submitted complaints and their status.</p>
        </div>
        <div className="flex gap-2">
          <Select value={wasteType} onValueChange={setWasteType}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Waste" /></SelectTrigger>
            <SelectContent>
              {['all','organic','plastic','e-waste','metal','glass','mixed'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={tox} onValueChange={setTox}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Toxicity" /></SelectTrigger>
            <SelectContent>
              {['all','low','medium','high'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ul className="grid gap-4">
        {filtered.map((c) => (
          <li key={c.id} className="rounded-lg border p-4 grid gap-3 md:grid-cols-[160px_1fr_auto] items-center">
            {c.image ? (
              <img src={c.image} alt={c.title} className="h-24 w-full md:w-40 object-cover rounded" />
            ) : (
              <div className="h-24 w-full md:w-40 bg-muted rounded grid place-items-center text-muted-foreground">No image</div>
            )}
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{c.wasteType}</Badge>
                <Badge variant={c.toxicity === 'high' ? 'destructive' : 'secondary'}>{c.toxicity}</Badge>
                <Badge>{c.status}</Badge>
              </div>
            </div>
            <div className="text-sm text-muted-foreground md:text-right">{c.lat.toFixed(3)}, {c.lng.toFixed(3)}</div>
          </li>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground">No posts yet.</p>}
      </ul>
    </div>
  );
}
