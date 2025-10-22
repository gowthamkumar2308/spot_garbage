import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppState";
import MapPicker from "@/components/MapPicker";

function MapEmbed({ lat, lng }: { lat: number; lng: number }) {
  const bbox = `${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <iframe
      title="map"
      className="w-full h-64 rounded border"
      src={src}
    ></iframe>
  );
}

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, updateComplaintStatus, deleteComplaint, user, collectComplaint } = useApp();
  const c = complaints.find((x) => x.id === id);

  const fallbackLat = 18.060534;
  const fallbackLng = 83.405583;
  const fallbackMapLink = "https://maps.app.goo.gl/pEVeM5ZmJmrYXcB68";
  const fallbackAddress = "Chintalavalasa, Andhra Pradesh 535005";
  const isFallback =
    c &&
    Math.abs(c.lat - fallbackLat) < 0.0001 &&
    Math.abs(c.lng - fallbackLng) < 0.0001;

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
          <div className="text-sm text-muted-foreground">
            Reported by {c.reporterName} •{" "}
            {new Date(c.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
          {/* Only workers/admins can change status */}
          {user?.role === "worker" && c.status !== "collected" && (
            <>
              <Button
                variant="secondary"
                onClick={() => updateComplaintStatus(c.id, "in_progress")}
              >
                In Progress
              </Button>
              <Button onClick={() => handleCollect(c.id)}>
                Collected
              </Button>
            </>
          )}
          {user?.id === c.reporterId && (
            <Button
              className="bg-red-600 text-white"
              onClick={() => {
                if (confirm("Delete this report?")) {
                  deleteComplaint(c.id);
                  navigate("/my-posts");
                }
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-4">
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="text-sm text-muted-foreground mb-2">
              Description
            </div>
            <div>{c.description}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">{c.wasteType}</Badge>
              <Badge
                variant={c.toxicity === "high" ? "destructive" : "secondary"}
              >
                {c.toxicity}
              </Badge>
              <Badge>{c.status}</Badge>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="text-sm text-muted-foreground mb-2">Location</div>
            <div className="mb-3">
              {c.lat.toFixed(6)}, {c.lng.toFixed(6)}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {isFallback ? fallbackAddress : ""}
            </div>
            <div className="text-xs text-muted-foreground mb-2">Map: pin shows the saved location. This view is read-only.</div>
            <MapPicker lat={c.lat} lng={c.lng} onSelect={() => {}} interactive={false} />
            <div className="mt-3 flex gap-2">
              <a
                className="text-sm underline"
                href={`https://maps.google.com/?q=${c.lat},${c.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
              {isFallback && (
                <a
                  className="text-sm underline"
                  href={fallbackMapLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open default location
                </a>
              )}
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground mb-2">Image</div>
          {c.image ? (
            <img
              src={c.image}
              alt={c.title}
              className="w-full rounded-md object-cover border"
            />
          ) : (
            <div className="h-48 w-full rounded-md bg-muted grid place-items-center text-muted-foreground">
              No image provided
            </div>
          )}

          {c.collectedImages && c.collectedImages.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-2">Collected photos</div>
              <div className="grid grid-cols-2 gap-2">
                {c.collectedImages.map((src, i) => (
                  <img key={i} src={src} alt={`collected-${i}`} className="w-full h-24 object-cover rounded" />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
