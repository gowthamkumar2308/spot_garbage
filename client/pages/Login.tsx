import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppState";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = () => {
    const acc = login(email.trim(), password);
    if (acc) {
      navigate(acc.role === "worker" ? "/worker/all-posts" : "/report");
    }
  };

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-2">Sign in</h1>
      <p className="text-muted-foreground mb-6">Login with your email and password.</p>
      <div className="grid gap-6 rounded-lg border p-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">No account? <Link to="/register" className="underline">Register</Link></div>
          <div className="flex gap-2">
            <Button onClick={submit} disabled={!email || !password}>Sign in</Button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        <div className="font-medium">Demo accounts</div>
        <div>User: user@example.com / password</div>
        <div>Admin: worker@example.com / password</div>
      </div>
    </div>
  );
}
