import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Trophy, 
  Gavel, 
  LogOut,
  Bell,
  Settings
} from 'lucide-react';
import { Button } from '../ui/Button';

// Mock context for user role (in a real app, this would be from Auth context)
export type UserRole = 'participant' | 'judge' | 'organizer' | null;

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Using a mock role for demonstration, normally read from context
  const role: UserRole = (localStorage.getItem('eventos_role') as UserRole) || 'participant';

  const handleLogout = () => {
    localStorage.removeItem('eventos_role');
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Events', path: '/events', icon: <CalendarDays className="w-5 h-5" /> },
    { label: 'Teams', path: '/teams', icon: <Users className="w-5 h-5" /> },
    ...(role === 'judge' || role === 'organizer' ? [{ label: 'Judging', path: '/judging', icon: <Gavel className="w-5 h-5" /> }] : []),
    { label: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-on-background overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-outline-variant bg-surface-container-low h-full">
        <div className="p-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary font-bold">
              E
            </div>
            <span className="text-xl font-bold tracking-tight font-display">EVENTOS</span>
          </div>
        </div>

        <div className="px-4 py-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          {role} Workspace
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-on-surface hover:bg-surface-container hover:text-on-surface"
                )}
              >
                {item.icon}
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                <span className="text-xs font-semibold">U</span>
              </div>
              <div className="text-sm">
                <p className="font-medium">User</p>
                <p className="text-xs text-on-surface-variant capitalize">{role}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="px-2" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4 text-on-surface-variant" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar for Mobile + Desktop Utilities */}
        <header className="h-16 border-b border-outline-variant bg-surface/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
              E
            </div>
            <span className="font-bold tracking-tight">EVENTOS</span>
          </div>
          
          <div className="hidden md:flex flex-1" />

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative px-2">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            </Button>
            <Button variant="ghost" size="sm" className="px-2">
              <Settings className="w-5 h-5 text-on-surface-variant" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8 h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-outline-variant bg-surface-container-lowest/90 backdrop-blur-lg pb-safe z-50">
        <div className="flex items-center justify-around p-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-colors w-16",
                  isActive 
                    ? "text-primary" 
                    : "text-on-surface-variant"
                )}
              >
                {React.cloneElement(item.icon as React.ReactElement, {
                  className: cn("w-5 h-5 mb-0.5", isActive ? "text-primary" : "text-on-surface-variant")
                })}
                <span className="truncate w-full text-center">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
