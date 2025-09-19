import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppState";
import { cn } from "@/lib/utils";
import { MapPin, PlusCircle, Recycle, ScrollText, User2, ListChecks } from "lucide-react";

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className={cn("px-3 py-2 rounded-md text-sm font-medium transition-colors", active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent")}>{children}</Link>
  );
};

export default function Header() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Recycle className="text-primary" />
          <span>Spot Garbage</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/">Home</NavLink>
          {user?.role !== "worker" && (
            <>
              <NavLink to="/report"><span className="inline-flex items-center gap-1"><PlusCircle className="h-4 w-4" /> Report</span></NavLink>
              <NavLink to="/my-posts"><span className="inline-flex items-center gap-1"><ScrollText className="h-4 w-4" /> My Posts</span></NavLink>
              <NavLink to="/track"><span className="inline-flex items-center gap-1"><ListChecks className="h-4 w-4" /> Track</span></NavLink>
            </>
          )}
          {user?.role === "worker" && (
            <>
              <NavLink to="/worker/all-posts">All Posts</NavLink>
              <NavLink to="/admin/map"><span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> Map</span></NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"><User2 className="h-4 w-4" /> {user.name} • {user.role}</Link>
              <Button variant="secondary" onClick={() => { logout(); navigate("/"); }}>Logout</Button>
            </div>
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
