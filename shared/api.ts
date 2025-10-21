/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export type Role = "user" | "worker";

export interface User {
  id: string;
  name: string;
  email?: string;
  role: Role;
}

export type WasteType =
  | "organic"
  | "plastic"
  | "e-waste"
  | "metal"
  | "glass"
  | "mixed";
export type Toxicity = "low" | "medium" | "high";
export type Status =
  | "submitted"
  | "verified"
  | "in_progress"
  | "collected"
  | "rejected";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  image?: string; // data URL
  collectedImages?: string[]; // images taken by workers when collecting
  lat: number;
  lng: number;
  wasteType: WasteType;
  toxicity: Toxicity;
  verified: boolean;
  status: Status;
  createdAt: number;
  reporterId: string; // account id of reporter
  reporterName: string;
}

export function seedComplaints(): Complaint[] {
  const base: Omit<Complaint, "id" | "createdAt" | "status">[] = [
    {
      title: "Overflowing bins near market",
      description:
        "Piled plastic bags and food waste attracting stray animals.",
      lat: 13.0827,
      lng: 80.2707,
      wasteType: "mixed",
      toxicity: "medium",
      verified: true,
      reporterName: "Aditi",
    },
    {
      title: "E-waste dump behind school",
      description: "Discarded batteries and circuit boards spotted.",
      lat: 12.9716,
      lng: 77.5946,
      wasteType: "e-waste",
      toxicity: "high",
      verified: true,
      reporterName: "Rahul",
    },
  ];
  return base.map((c, i) => ({
    ...c,
    id: crypto.randomUUID(),
    createdAt: Date.now() - Math.floor(Math.random() * 1e7),
    status: c.verified ? "verified" : "submitted",
    reporterId: `seed-${i}`,
    reporterName: c.reporterName ?? `seed-${i}`,
  }));
}
