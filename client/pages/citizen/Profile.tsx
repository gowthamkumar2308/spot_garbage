import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppState";

export default function Profile() {
  const { user, updateAccount } = useApp();
  if (!user) return null;
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  const save = () => {
    updateAccount(user.id, { name: name.trim() || undefined, email: email.trim() || undefined, phone: phone || undefined, dob: dob || undefined });
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-1">Profile</h1>
      <p className="text-muted-foreground mb-6">Update your account details. Role cannot be changed.</p>
      <div className="rounded-2xl border bg-card p-6 grid gap-4">
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Phone (optional)</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Date of birth (optional)</Label>
          <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2 items-center">
          <div className="text-sm text-muted-foreground">Role: <span className="capitalize">{user.role === 'worker' ? 'Admin' : 'User'}</span></div>
          <div className="text-right">
            <Button onClick={save}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
