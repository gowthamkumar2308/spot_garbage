import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Upload,
  Workflow,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="container py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
              🗑️ Spot Garbage • Waste Detection & Reporting
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
              Rescue remote areas from dump-yard impact.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Detect, report, and track garbage dumps in real-time with
              geotagged images and ML verification. Empower citizens and admins
              (sanitary workers) to act fast.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/report" className="inline-flex items-center gap-2">
                  Report Garbage <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/login" className="inline-flex items-center gap-2">
                  Sign in as Admin
                </Link>
              </Button>
            </div>
            <ul className="mt-6 grid gap-2 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> ML-based
                verification
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Geotagged reports
              </li>
              <li className="inline-flex items-center gap-2">
                <BellRing className="h-4 w-4 text-primary" /> Instant
                notifications
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 border">
                  <div className="font-medium mb-1 inline-flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Upload
                  </div>
                  <p className="text-muted-foreground">
                    Post geotagged images of garbage.
                  </p>
                </div>
                <div className="rounded-md bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 border">
                  <div className="font-medium mb-1 inline-flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Verify
                  </div>
                  <p className="text-muted-foreground">
                    ML detects waste automatically.
                  </p>
                </div>
                <div className="rounded-md bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 border">
                  <div className="font-medium mb-1 inline-flex items-center gap-2">
                    <Workflow className="h-4 w-4" /> Sort
                  </div>
                  <p className="text-muted-foreground">
                    Filter by toxicity and type.
                  </p>
                </div>
                <div className="rounded-md bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 border">
                  <div className="font-medium mb-1 inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Collect
                  </div>
                  <p className="text-muted-foreground">
                    Admins close complaints fast.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <h2 className="text-2xl font-bold mb-6">
            Designed for citizens and admins
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold text-lg">For Citizens</h3>
              <ul className="mt-3 list-disc pl-5 text-muted-foreground">
                <li>Upload geotagged photos</li>
                <li>Select waste type: organic, plastic, e-waste, etc.</li>
                <li>Track status: submitted → verified → collected</li>
                <li>Manage profile and posts</li>
              </ul>
              <Button className="mt-4" asChild>
                <Link to="/report">Start Reporting</Link>
              </Button>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold text-lg">
                For Admins (Sanitary Workers)
              </h3>
              <ul className="mt-3 list-disc pl-5 text-muted-foreground">
                <li>View all complaints city-wide</li>
                <li>Prioritize by toxicity and waste type</li>
                <li>Update status to Collected after cleanup</li>
                <li>Map view to plan routes</li>
              </ul>
              <Button className="mt-4" variant="secondary" asChild>
                <Link to="/login">Sign in as Admin</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container py-16">
          <h2 className="text-2xl font-bold mb-6">How it works</h2>
          <ol className="grid md:grid-cols-3 gap-6">
            {[
              {
                t: "User Upload",
                d: "Click or upload a photo and submit location.",
              },
              { t: "ML Verification", d: "Backend model checks for garbage." },
              { t: "Sorting", d: "Filter by waste type & toxicity." },
              { t: "Admin Review", d: "View reports on the map." },
              { t: "Cleanup Update", d: "Mark as Collected after cleanup." },
              { t: "Community", d: "70% willing to participate—make it easy." },
            ].map((s, i) => (
              <li key={i} className="rounded-xl border p-5 bg-card">
                <div className="text-3xl font-extrabold text-primary">
                  {i + 1}
                </div>
                <div className="mt-2 font-semibold">{s.t}</div>
                <div className="text-sm text-muted-foreground">{s.d}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
