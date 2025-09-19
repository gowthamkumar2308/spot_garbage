import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Complaint, Role, User } from "@shared/api";
import { seedComplaints } from "@shared/api";

interface AppState {
  user: User | null;
  login: (role: Role, name: string) => void;
  logout: () => void;
  complaints: Complaint[];
  addComplaint: (c: Omit<Complaint, "id" | "status" | "createdAt">) => Complaint;
  updateComplaintStatus: (id: string, status: Complaint["status"]) => void;
}

const Ctx = createContext<AppState | undefined>(undefined);

const STORAGE_KEY = "spotg_state_v1";

function loadState(): { user: User | null; complaints: Complaint[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { user: null, complaints: seedComplaints() };
}

function persist(state: { user: User | null; complaints: Complaint[] }) {
  // Avoid storing large image data URLs in localStorage which can easily exceed quota.
  try {
    const sanitized = {
      user: state.user,
      complaints: state.complaints.map(({ image, ...rest }) => rest),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    // If we hit quota, try a smaller payload: keep only the most recent 20 complaints (without images).
    try {
      const small = {
        user: state.user,
        complaints: state.complaints.slice(0, 20).map(({ image, ...rest }) => rest),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(small));
    } catch (err2) {
      // Final fallback: persist only user info to avoid breaking the app.
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user, complaints: [] }));
      } catch (err3) {
        // Give up silently but log to console for debugging.
        // Avoid throwing here so the app remains usable even if persistence fails.
        // eslint-disable-next-line no-console
        console.warn("Failed to persist app state to localStorage", err3);
      }
    }
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const s = loadState();
    setUser(s.user);
    setComplaints(s.complaints);
  }, []);

  useEffect(() => {
    persist({ user, complaints });
  }, [user, complaints]);

  const login = (role: Role, name: string) => {
    const u: User = { id: crypto.randomUUID(), name, role };
    setUser(u);
    toast.success(`Welcome, ${name}!`);
  };

  const logout = () => {
    setUser(null);
    toast.info("Logged out");
  };

  const addComplaint: AppState["addComplaint"] = (c) => {
    const item: Complaint = {
      ...c,
      id: crypto.randomUUID(),
      status: c.verified ? "verified" : "submitted",
      createdAt: Date.now(),
    };
    setComplaints((prev) => [item, ...prev]);
    toast.success("Complaint submitted");
    return item;
  };

  const updateComplaintStatus: AppState["updateComplaintStatus"] = (id, status) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    if (status === "collected") toast.success("Marked as Collected");
  };

  const value = useMemo<AppState>(() => ({ user, login, logout, complaints, addComplaint, updateComplaintStatus }), [user, complaints]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
