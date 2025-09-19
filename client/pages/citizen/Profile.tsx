import { useApp } from "@/context/AppState";

export default function Profile() {
  const { user } = useApp();
  if (!user) return null;
  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-1">Profile</h1>
      <p className="text-muted-foreground mb-6">Your account details.</p>
      <div className="rounded-lg border p-6 grid gap-3">
        <div className="grid grid-cols-3 gap-2"><span className="text-muted-foreground">Name</span><span className="col-span-2">{user.name}</span></div>
        <div className="grid grid-cols-3 gap-2"><span className="text-muted-foreground">Role</span><span className="col-span-2 capitalize">{user.role}</span></div>
      </div>
    </div>
  );
}
