import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApp } from "@/context/AppState";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useApp();
  const [role, setRole] = useState<"citizen" | "worker" | "admin">("citizen");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-2">Sign in</h1>
      <p className="text-muted-foreground mb-6">Choose your role and continue.</p>
      <div className="grid gap-6 rounded-lg border p-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-3">
          <Label>Role</Label>
          <RadioGroup className="grid grid-cols-1 md:grid-cols-3 gap-3" value={role} onValueChange={(v) => setRole(v as any)}>
            <label className="flex items-center gap-2 rounded-md border p-3 cursor-pointer">
              <RadioGroupItem value="citizen" /> Citizen (Sanitary Collector)
            </label>
            <label className="flex items-center gap-2 rounded-md border p-3 cursor-pointer">
              <RadioGroupItem value="worker" /> Sanitary Worker
            </label>
            <label className="flex items-center gap-2 rounded-md border p-3 cursor-pointer">
              <RadioGroupItem value="admin" /> Admin
            </label>
          </RadioGroup>
        </div>
        <div className="flex justify-end">
          <Button disabled={!name.trim()} onClick={() => { login(role, name.trim()); navigate(role === "worker" ? "/worker/all-posts" : "/report"); }}>Continue</Button>
        </div>
      </div>
    </div>
  );
}
