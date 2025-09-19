import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Complaint, Role, User } from "@shared/api";
import { seedComplaints } from "@shared/api";

interface Account {
  id: string;
  email: string;
  password: string; // Stored in plain text for demo only (do NOT do this in production)
  role: Role;
  name?: string;
  phone?: string;
  dob?: string;
}

interface AppState {
  user: User | null;
  register: (email: string, password: string, role: Role, name?: string) => Account | null;
  login: (email: string, password: string) => Account | null;
  logout: () => void;
  complaints: Complaint[];
  addComplaint: (c: Omit<Complaint, "id" | "status" | "createdAt">) => Complaint;
  updateComplaintStatus: (id: string, status: Complaint["status"]) => void;
  deleteComplaint: (id: string) => void;
  updateAccount: (id: string, updates: Partial<Pick<Account, "name" | "email" | "phone" | "dob">>) => void;
  accounts: Account[];
}

const Ctx = createContext<AppState | undefined>(undefined);

const STORAGE_KEY = "spotg_state_v1";
const ACCOUNTS_KEY = "spotg_accounts_v1";

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
    try {
      const small = {
        user: state.user,
        complaints: state.complaints.slice(0, 20).map(({ image, ...rest }) => rest),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(small));
    } catch (err2) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user, complaints: [] }));
      } catch (err3) {
        console.warn("Failed to persist app state to localStorage", err3);
      }
    }
  }
}

function loadAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Seed demo accounts
  const demo: Account[] = [
    { id: crypto.randomUUID(), email: "user@example.com", password: "password", role: "user", name: "Demo User" },
    { id: crypto.randomUUID(), email: "worker@example.com", password: "password", role: "worker", name: "Demo Worker" },
  ];
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(demo));
  return demo;
}

function persistAccounts(accounts: Account[]) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.warn("Failed to persist accounts", err);
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const s = loadState();
    setUser(s.user);
    setComplaints(s.complaints);
    setAccounts(loadAccounts());
  }, []);

  useEffect(() => {
    persist({ user, complaints });
  }, [user, complaints]);

  useEffect(() => {
    persistAccounts(accounts);
  }, [accounts]);

  const register = (email: string, password: string, role: Role, name?: string) => {
    if (accounts.find((a) => a.email === email)) return null;
    const acc: Account = { id: crypto.randomUUID(), email, password, role, name };
    setAccounts((s) => [acc, ...s]);
    toast.success("Registered successfully");
    return acc;
  };

  const login = (email: string, password: string) => {
    const acc = accounts.find((a) => a.email === email && a.password === password) || null;
    if (!acc) {
      toast.error("Invalid credentials");
      return null;
    }
    const u: User = { id: acc.id, name: acc.name || acc.email.split("@")[0], email: acc.email, role: acc.role };
    setUser(u);
    toast.success(`Welcome, ${u.name}`);
    return acc;
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

  const value = useMemo<AppState>(() => ({ user, register, login, logout, complaints, addComplaint, updateComplaintStatus, accounts }), [user, complaints, accounts]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
