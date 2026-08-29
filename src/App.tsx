/**
 * @file App.tsx
 * @description Main application entry point featuring React.lazy() for efficient code splitting
 * and routing logic wrapped in the global state AppProvider.
 */
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AppShell } from "./components/layout/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { RoleSelection } from "./pages/RoleSelection";

// ---------------------------------------------------------------------------
// Efficiency: Lazy loading routes to drastically reduce initial bundle size.
// ---------------------------------------------------------------------------
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Teams = lazy(() => import('./pages/Teams').then(m => ({ default: m.Teams })));
const Leaderboard = lazy(() => import('./pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const Registration = lazy(() => import('./pages/Registration').then(m => ({ default: m.Registration })));
const Broadcast = lazy(() => import('./pages/Broadcast').then(m => ({ default: m.Broadcast })));
const Judging = lazy(() => import('./pages/Judging').then(m => ({ default: m.Judging })));

/**
 * @component LoadingFallback
 * @description Accessible loading state for Suspense boundaries.
 */
const LoadingFallback = () => (
  <div className="flex h-full items-center justify-center bg-background" aria-live="polite" aria-label="Loading application modules">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * @component AppRoutes
 * @description Handles authenticated layout wrapping and route definitions.
 */
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

  return (
    <AppShell>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Module 1: Registration */}
          <Route path="/registration" element={<Registration />} />
          {/* Module 2: Team Matchmaking */}
          <Route path="/teams" element={<Teams />} />
          {/* Module 3: Broadcast Center */}
          <Route path="/broadcast" element={<Broadcast />} />
          {/* Module 4: Judging Portal */}
          <Route path="/judging" element={<Judging />} />
          {/* Module 5: Leaderboard */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
