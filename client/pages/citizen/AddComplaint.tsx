import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppState";
import { useState, useEffect } from "react";
import { verifyImageContainsGarbage } from "@/services/ml";
import type { Toxicity, WasteType } from "@shared/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MapPicker from "@/components/MapPicker";

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
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(f);
  };

  // When map picker selects location, update lat/lng strings and loc
  const onMapSelect = (lat: number, lng: number) => {
    setLoc({ lat, lng });
    setLatStr(String(lat));
    setLngStr(String(lng));
  };

  const parseCoord = (val: string, fallback?: number) => {
    if (!val || val.trim() === "")
      return typeof fallback === "number" ? fallback : NaN;
    // Allow comma or space as decimal separator
    const normalized = val.trim().replace(/,/g, ".");
    const n = Number(normalized);
    return isFinite(n) ? n : NaN;
  };

  const getLocation = (opts?: PositionOptions) => {
    // Default map location (Chintalavalasa)
    const fallbackLat = 18.060534;
    const fallbackLng = 83.405583;

    if (!navigator.geolocation) {
      toast.info("Geolocation not supported — using default location");
      const coords = { lat: fallbackLat, lng: fallbackLng };
      setLoc(coords);
      setLatStr(String(coords.lat));
      setLngStr(String(coords.lng));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLoc(coords);
        setLatStr(String(coords.lat));
        setLngStr(String(coords.lng));
      },
      (err) => {
        // On permission denied or other errors, default to provided coordinates
        toast.info(
          "Using default location — grant location permission for live coordinates",
        );
        const coords = { lat: fallbackLat, lng: fallbackLng };
        setLoc(coords);
        setLatStr(String(coords.lat));
        setLngStr(String(coords.lng));
      },
      opts ?? { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const getCurrentPositionAsync = (opts?: PositionOptions) =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
      navigator.geolocation.getCurrentPosition(resolve, reject, opts ?? { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
    });

  // Attempt to prefill with live location on mount; falls back to default if unavailable
  useEffect(() => {
    getLocation();
  }, []);

  const submit = async () => {
    setSubmitted(true);
    if (!user) return;

    // Try to obtain a fresh high-accuracy location right before submitting
    try {
      const pos = await getCurrentPositionAsync({ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setLoc(coords);
      setLatStr(String(coords.lat));
      setLngStr(String(coords.lng));
    } catch (err) {
      // Ignore — we'll use whatever location is available (prefilled or manual)
    }

    const lat = parseCoord(latStr, loc?.lat);
    const lng = parseCoord(lngStr, loc?.lng);
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!image) {
      toast.error("Photo is required");
      return;
    }
    if (!isFinite(lat) || !isFinite(lng)) {
      toast.error("Please add a valid location");
      return;
    }
    setLoading(true);
    const ml = await verifyImageContainsGarbage({
      title,
      description,
      image,
      wasteType,
    });
    const c = addComplaint({
      title,
      description,
      image,
      lat,
      lng,
      wasteType,
      toxicity,
      verified: ml.verified,
      reporterId: user.id,
      reporterName: user.name,
    });
    setLoading(false);
    toast.info(
      ml.verified
        ? `Verified (${Math.round(ml.confidence)}%)`
        : "Pending manual review",
    );
    navigate("/track");
  };

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-1">Report Garbage</h1>
      <p className="text-muted-foreground mb-6">
        Upload a photo, tag waste type, and submit your location.
      </p>
      <div className="grid gap-6 rounded-2xl border p-6 bg-card shadow-sm">
        <div className="grid gap-2">
          <Label htmlFor="title">
            Title <span className="text-destructive-foreground">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary"
          />
          {submitted && !title.trim() && (
            <div className="text-sm text-destructive mt-1">
              Title is required
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details that help admins locate and assess the site"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label>Waste type</Label>
            <Select
              value={wasteType}
              onValueChange={(v) => setWasteType(v as WasteType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
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
            <Select
              value={toxicity}
              onValueChange={(v) => setToxicity(v as Toxicity)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
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
                <Button type="button" variant="secondary" onClick={getLocation}>
                  Use my location
                </Button>
                <span className="text-sm text-muted-foreground self-center">
                  or enter manually
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
                <Input
                  placeholder="Latitude"
                  value={latStr}
                  onChange={(e) => setLatStr(e.target.value)}
                  onBlur={() => {
                    const lat = parseCoord(latStr, loc?.lat);
                    const lng = parseCoord(lngStr, loc?.lng);
                    if (isFinite(lat) && isFinite(lng)) setLoc({ lat, lng });
                  }}
                />
                <Input
                  placeholder="Longitude"
                  value={lngStr}
                  onChange={(e) => setLngStr(e.target.value)}
                  onBlur={() => {
                    const lat = parseCoord(latStr, loc?.lat);
                    const lng = parseCoord(lngStr, loc?.lng);
                    if (isFinite(lat) && isFinite(lng)) setLoc({ lat, lng });
                  }}
                />
              </div>
              <div className="mt-2">
                <div className="text-sm mb-2">Pick location on map</div>
                <MapPicker
                  lat={loc?.lat ?? 18.060534}
                  lng={loc?.lng ?? 83.405583}
                  onSelect={onMapSelect}
                />
              </div>
            </div>
            {submitted &&
              (!isFinite(parseCoord(latStr, loc?.lat)) ||
                !isFinite(parseCoord(lngStr, loc?.lng))) && (
                <div className="text-sm text-destructive mt-1">
                  Valid latitude and longitude are required
                </div>
              )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label>
            Photo <span className="text-destructive-foreground">*</span>
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && onFile(e.target.files[0])}
          />
          {submitted && !image && (
            <div className="text-sm text-destructive mt-1">
              Photo is required
            </div>
          )}
          {image && (
            <img
              src={image}
              alt="preview"
              className="mt-2 h-48 w-full object-cover rounded-md border"
            />
          )}
        </div>
        <div className="flex justify-end">
          <Button
            disabled={
              loading ||
              !title.trim() ||
              !image ||
              !isFinite(parseCoord(latStr, loc?.lat)) ||
              !isFinite(parseCoord(lngStr, loc?.lng))
            }
            onClick={submit}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
