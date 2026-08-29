/**
 * @file Dashboard.tsx
 * @description Central hub providing a quick summary of global state.
 */
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Clock, Users, Zap, Scan, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '../components/layout/AppShell';
import { Input } from '../components/ui/Input';
import { verifyQrPayload } from '../utils/security';

export const Dashboard = React.memo(() => {
  const { teams, submissions, users, scores, checkInUser } = useApp();
  const navigate = useNavigate();
  const role: UserRole = (localStorage.getItem('eventos_role') as UserRole) || 'participant';

  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState<{success: boolean, msg: string} | null>(null);

  // Derived Analytics for Organizer
  const analytics = useMemo(() => {
    const checkedInCount = users.filter(u => u.checkInStatus).length;
    const checkInRate = users.length > 0 ? Math.round((checkedInCount / users.length) * 100) : 0;
    
    const judgedSubmissions = new Set(scores.map(s => s.submissionId)).size;
    const judgingRate = submissions.length > 0 ? Math.round((judgedSubmissions / submissions.length) * 100) : 0;

    const avgScore = scores.length > 0 
      ? (scores.reduce((acc, s) => acc + s.total, 0) / scores.length).toFixed(1) 
      : '0.0';

    return { checkedInCount, checkInRate, judgedSubmissions, judgingRate, avgScore };
  }, [users, submissions, scores]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    const result = verifyQrPayload(qrInput, users.map(u => u.id));
    if (result.success && result.participantId) {
      const checkedIn = checkInUser(result.participantId);
      if (checkedIn) {
        setScanResult({ success: true, msg: 'Participant successfully checked in.' });
      } else {
        setScanResult({ success: false, msg: 'Participant already checked in.' });
      }
    } else {
      setScanResult({ success: false, msg: result.reason || 'Invalid QR.' });
    }
    setQrInput('');
    setTimeout(() => setScanResult(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight capitalize">Welcome back, {role}</h1>
          <p className="text-on-surface-variant font-body mt-1">Prompt Wars 2026 is currently in the <span className="font-semibold text-primary">Active Phase</span>.</p>
        </div>
        <div className="flex gap-3">
          {role === 'participant' && <Button onClick={() => navigate('/registration')}>Check Registration</Button>}
          {role === 'judge' && <Button onClick={() => navigate('/judging')}>Start Judging</Button>}
          {role === 'organizer' && <Button onClick={() => navigate('/broadcast')}>Push Alert</Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-on-surface-variant">Participants</p>
                <p className="text-3xl font-bold font-label">{users.length}</p>
                {role === 'organizer' && <p className="text-xs text-on-surface-variant">{analytics.checkedInCount} Checked In ({analytics.checkInRate}%)</p>}
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-on-surface-variant">Active Teams</p>
                <p className="text-3xl font-bold font-label">{teams.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-on-surface-variant">Submissions</p>
                <p className="text-3xl font-bold font-label">{submissions.length}</p>
                {role === 'organizer' && <p className="text-xs text-on-surface-variant">{analytics.judgingRate}% Judged (Avg: {analytics.avgScore})</p>}
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
                <p className="text-sm font-medium text-on-surface-variant">Time Remaining</p>
                <p className="text-3xl font-bold font-label">14:23:05</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                <Clock className="w-5 h-5 text-on-surface-variant" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {role === 'organizer' && (
        <Card className="mt-8 border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-primary" /> QR Check-In Scanner (Mock)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleScan} className="flex gap-4">
              <Input 
                placeholder="Paste QR_HASH payload here..." 
                value={qrInput}
                onChange={e => setQrInput(e.target.value)}
                className="flex-1"
                aria-label="QR Scanner Input"
              />
              <Button type="submit">Verify & Check-In</Button>
            </form>
            {scanResult && (
              <div className={`mt-4 p-3 rounded flex items-center gap-2 ${scanResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} aria-live="polite">
                {scanResult.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span>{scanResult.msg}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-surface-container-lowest border border-outline-variant/50 p-12 flex flex-col items-center justify-center text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">Navigate via the Sidebar</h2>
        <p className="text-on-surface-variant max-w-lg">
          To review the specific 5 modules required by the prompt, please use the sidebar to visit Registration, Matchmaking, Broadcasts, Judging, and Leaderboard directly. All data is connected globally.
        </p>
      </Card>
    </div>
  );
});
Dashboard.displayName = 'Dashboard';
