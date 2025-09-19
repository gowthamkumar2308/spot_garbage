import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppProvider, useApp } from "./context/AppState";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddComplaint from "./pages/citizen/AddComplaint";
import MyPosts from "./pages/citizen/MyPosts";
import TrackComplaints from "./pages/citizen/TrackComplaints";
import Profile from "./pages/citizen/Profile";
import WorkerAllPosts from "./pages/worker/AllPosts";
import ReportView from "./pages/worker/ReportView";
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: ("user" | "worker")[] }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Shell>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              {/* Citizen */}
              <Route
                path="/report"
                element={
                  <ProtectedRoute roles={["user", "worker"]}>
                    <AddComplaint />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-posts"
                element={
                  <ProtectedRoute roles={["user", "worker"]}>
                    <MyPosts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/track"
                element={
                  <ProtectedRoute roles={["user", "worker"]}>
                    <TrackComplaints />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute roles={["user", "worker"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* Worker */}
              <Route
                path="/worker/all-posts"
                element={
                  <ProtectedRoute roles={["worker"]}>
                    <WorkerAllPosts />
                  </ProtectedRoute>
                }
              />
              <Route path="/register" element={<Register />} />
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Shell>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<Root />);
