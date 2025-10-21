import { useApp } from "@/context/AppState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TrackComplaints() {
  const { complaints, user, updateComplaintStatus, collectComplaint } = useApp();
  const [sort, setSort] = useState<string>("new");

  const readFilesAsDataUrls = (files: FileList | null) =>
    new Promise<string[]>((resolve, reject) => {
      if (!files || files.length === 0) return resolve([]);
      const arr = Array.from(files);
      Promise.all(
        arr.map(
          (file) =>
            new Promise<string>((res, rej) => {
              const reader = new FileReader();
              reader.onload = () => res(String(reader.result));
              reader.onerror = (e) => rej(e);
              reader.readAsDataURL(file);
            }),
        ),
      )
        .then((data) => resolve(data))
        .catch(reject);
    });

  const handleCollect = async (id: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async () => {
      try {
        const images = await readFilesAsDataUrls(input.files);
        if (!images || images.length === 0) return;
        collectComplaint(id, images);
      } catch (err) {
        console.error(err);
        updateComplaintStatus(id, "collected");
      }
    };
    input.click();
  };

  const list = useMemo(() => {
    const items =
      user?.role === "worker"
        ? complaints
        : complaints.filter((c) => c.reporterName === user?.name);
    return items.sort((a, b) =>
      sort === "tox"
        ? a.toxicity > b.toxicity
          ? -1
          : 1
        : b.createdAt - a.createdAt,
    );
  }, [complaints, user, sort]);

  return (
    <div className="container py-8">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold">Track Complaints</h1>
          <p className="text-muted-foreground">
            Monitor status and progress of reported dumps.
          </p>
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Newest</SelectItem>
            <SelectItem value="tox">Toxicity</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ul className="grid gap-4">
        {list.map((c) => (
          <li
            key={c.id}
            className="rounded-2xl border p-4 grid gap-3 md:grid-cols-[1fr_auto] items-center bg-card shadow-sm"
          >
            <div>
              <h3 className="font-semibold">
                {c.title}{" "}
                <span className="text-xs text-muted-foreground">
                  ({c.lat.toFixed(3)}, {c.lng.toFixed(3)})
                </span>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {c.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{c.wasteType}</Badge>
                <Badge
                  variant={c.toxicity === "high" ? "destructive" : "secondary"}
                >
                  {c.toxicity}
                </Badge>
                <Badge>{c.status}</Badge>
              </div>
            </div>
            {user?.role === "worker" && c.status !== "collected" && (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => updateComplaintStatus(c.id, "in_progress")}
                >
                  In Progress
                </Button>
                <Button
                  onClick={() => handleCollect(c.id)}
                >
                  Collected
                </Button>
              </div>
            )}
          </li>
        ))}
        {list.length === 0 && (
          <p className="text-muted-foreground">No complaints to track.</p>
        )}
      </ul>
    </div>
  );
}
