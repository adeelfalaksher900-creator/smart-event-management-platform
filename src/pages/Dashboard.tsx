import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Activity, Clock, Users, Zap, CheckCircle2 } from 'lucide-react';
import type { UserRole } from '../components/layout/AppShell';

export function Dashboard() {
  const role = (localStorage.getItem('eventos_role') as UserRole) || 'participant';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome back, {role}</h1>
          <p className="text-on-surface-variant font-body mt-1">
            Prompt Wars 2026 is currently in the <span className="font-semibold text-primary">Hacking Phase</span>.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">View Schedule</Button>
          {role === 'participant' && <Button>Submit Project</Button>}
          {role === 'judge' && <Button>Start Judging</Button>}
          {role === 'organizer' && <Button>Broadcast Message</Button>}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-on-surface-variant">Time Remaining</p>
                <p className="text-3xl font-bold font-label">14:23:05</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-on-surface-variant">Active Teams</p>
                <p className="text-3xl font-bold font-label">128</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-on-surface-variant">Submissions</p>
                <p className="text-3xl font-bold font-label">42</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-on-surface-variant">System Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-lg font-bold">Optimal</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                <Activity className="w-5 h-5 text-on-surface-variant" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed / Action Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "API Keys Distributed", time: "10 mins ago", type: "urgent", icon: <Zap className="w-4 h-4" /> },
                { title: "Lunch is served in the main hall", time: "2 hours ago", type: "info", icon: <CheckCircle2 className="w-4 h-4" /> },
                { title: "Hacking phase officially begins!", time: "5 hours ago", type: "announcement", icon: <Activity className="w-4 h-4" /> }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/50">
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    item.type === 'urgent' ? 'bg-error/10 text-error' : 
                    item.type === 'info' ? 'bg-secondary/10 text-secondary' : 
                    'bg-primary/10 text-primary'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Widget Area */}
        <div className="space-y-6">
          {role === 'participant' && (
            <Card className="border-primary/50 shadow-sm shadow-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-primary flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  My Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-lg mb-1">Neural Ninjas</h4>
                    <Badge variant="outline">Looking for Frontend</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold">AL</div>
                      <div className="text-sm">
                        <p className="font-medium">Alex L.</p>
                        <p className="text-xs text-on-surface-variant">Backend (You)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold">SM</div>
                      <div className="text-sm">
                        <p className="font-medium">Sarah M.</p>
                        <p className="text-xs text-on-surface-variant">AI Specialist</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" variant="secondary">Manage Team</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {role === 'judge' && (
            <Card>
              <CardHeader>
                <CardTitle>Judging Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-md bg-surface-container-low">
                    <span className="font-medium">Team Alpha</span>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-surface-container-low">
                    <span className="font-medium">Quantum UX</span>
                    <Badge variant="success">Scored</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4">Go to Portal</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
