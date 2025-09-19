import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApp } from "@/context/AppState";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useApp();
  const [role, setRole] = useState<"user" | "worker">("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = () => {
    if (!email || !password) return;
    const acc = register(email.trim(), password, role, name || undefined);
    if (acc) {
      navigate("/login");
    }
  };

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-2">Register</h1>
      <p className="text-muted-foreground mb-6">Create an account as a Citizen or Worker.</p>

      <div className="grid gap-6 rounded-lg border p-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Full name (optional)</Label>
          <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="grid gap-3">
          <Label>Role</Label>
          <RadioGroup className="grid grid-cols-2 gap-3" value={role} onValueChange={(v) => setRole(v as any)}>
            <label className="flex items-center gap-2 rounded-md border p-3 cursor-pointer">
              <RadioGroupItem value="user" /> User
            </label>
            <label className="flex items-center gap-2 rounded-md border p-3 cursor-pointer">
              <RadioGroupItem value="worker" /> Worker (Admin)
            </label>
          </RadioGroup>
        </div>
        <div className="flex justify-end">
          <Button disabled={!email || !password} onClick={submit}>Create account</Button>
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        <div className="font-medium">Demo accounts</div>
        <div>User: user@example.com / password</div>
        <div>Worker: worker@example.com / password</div>
      </div>
    </div>
  );
}
