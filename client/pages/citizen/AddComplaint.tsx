import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppState";
import { useState } from "react";
import { verifyImageContainsGarbage } from "@/services/ml";
import type { Toxicity, WasteType } from "@shared/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AddComplaint() {
  const { addComplaint, user } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wasteType, setWasteType] = useState<WasteType>("mixed");
  const [toxicity, setToxicity] = useState<Toxicity>("low");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [latStr, setLatStr] = useState<string>("");
  const [lngStr, setLngStr] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(f);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLoc(coords);
        setLatStr(String(coords.lat));
        setLngStr(String(coords.lng));
      },
      () => toast.error("Unable to fetch location")
    );
  };

  const submit = async () => {
    if (!user) return;
    const lat = Number(latStr || (loc?.lat ?? NaN));
    const lng = Number(lngStr || (loc?.lng ?? NaN));
    if (!isFinite(lat) || !isFinite(lng)) {
      toast.error("Please add a valid location");
      return;
    }
    setLoading(true);
    const ml = await verifyImageContainsGarbage({ title, description, image, wasteType });
    const c = addComplaint({
      title,
      description,
      image,
      lat,
      lng,
      wasteType,
      toxicity,
      verified: ml.verified,
      reporterName: user.name,
    });
    setLoading(false);
    toast.info(ml.verified ? `Verified (${Math.round(ml.confidence)}%)` : "Pending manual review");
    navigate("/track");
  };

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-1">Report Garbage</h1>
      <p className="text-muted-foreground mb-6">Upload a photo, tag waste type, and submit your location.</p>
      <div className="grid gap-6 rounded-lg border p-6">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short summary" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add details that help admins locate and assess the site" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label>Waste type</Label>
            <Select value={wasteType} onValueChange={(v) => setWasteType(v as WasteType)}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="organic">Organic</SelectItem>
                <SelectItem value="plastic">Plastic</SelectItem>
                <SelectItem value="e-waste">E-waste</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="glass">Glass</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Toxicity</Label>
            <Select value={toxicity} onValueChange={(v) => setToxicity(v as Toxicity)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Location</Label>
            <div className="flex gap-2 flex-col md:flex-row">
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={getLocation}>Use my location</Button>
                <span className="text-sm text-muted-foreground self-center">or enter manually</span>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
                <Input placeholder="Latitude" value={latStr} onChange={(e) => setLatStr(e.target.value)} />
                <Input placeholder="Longitude" value={lngStr} onChange={(e) => setLngStr(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Photo</Label>
          <Input type="file" accept="image/*" onChange={(e) => e.target.files && onFile(e.target.files[0])} />
          {image && <img src={image} alt="preview" className="mt-2 h-48 w-full object-cover rounded-md border" />}
        </div>
        <div className="flex justify-end">
          <Button disabled={loading || !title || !description || !loc} onClick={submit}>{loading ? "Submitting..." : "Submit"}</Button>
        </div>
      </div>
    </div>
  );
}
