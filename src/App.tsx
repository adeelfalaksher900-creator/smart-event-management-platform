import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { RoleSelection } from "./pages/RoleSelection";
import { Dashboard } from "./pages/Dashboard";
import { Teams } from "./pages/Teams";
import { Leaderboard } from "./pages/Leaderboard";

// Dummy page components to fill remaining routes
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="h-full flex flex-col">
    <h1 className="text-3xl font-headline font-bold mb-6">{title}</h1>
    <div className="flex-1 flex items-center justify-center border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest/50">
      <p className="text-on-surface-variant">Module Content Loading...</p>
    </div>
  </div>
);

function AppRoutes() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/" || location.pathname === "/select-role";

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-role" element={<RoleSelection />} />
      </Routes>
    );
  }

  // Wrapped with AppShell
  return (
    <AppShell>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<PlaceholderPage title="Events" />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/judging" element={<PlaceholderPage title="Judging Portal" />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}


