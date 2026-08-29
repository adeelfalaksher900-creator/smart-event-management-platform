/**
 * @file Teams.tsx
 * @description Module 2: Smart Team Formation. Utilizes the global state and algorithm
 * to dynamically match users to teams. Highly optimized with React.memo and useMemo.
 */
import React, { useMemo, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Search, ShieldCheck, Cpu, Code, Paintbrush, Clock, Check } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { calculateMatchScore } from '../utils/matchmaking';
import type { Team } from '../context/AppContext';

/**
 * @component TeamCard
 * @description Renders a single team. Memoized to prevent re-renders during list filtering.
 */
const TeamCard = React.memo(({ 
  team, 
  matchData, 
  requestStatus, 
  onRequest 
}: { 
  team: Team, 
  matchData?: { score: number, reasons: string[] },
  requestStatus: 'pending' | 'accepted' | 'declined' | 'none',
  onRequest: (teamId: string) => void
}) => {
  return (
    <Card className="flex flex-col border border-outline-variant hover:border-primary/50 transition-all">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{team.name}</CardTitle>
            <p className="text-sm text-on-surface-variant mt-1">{team.members.length}/{team.size} Members</p>
          </div>
          {team.type === 'AI' && <div className="p-2 bg-primary/10 rounded-lg"><Cpu className="w-4 h-4 text-primary" aria-label="AI Team" /></div>}
          {team.type === 'UX' && <div className="p-2 bg-secondary/10 rounded-lg"><Paintbrush className="w-4 h-4 text-secondary" aria-label="UX Team" /></div>}
          {team.type === 'Data' && <div className="p-2 bg-tertiary/10 rounded-lg"><ShieldCheck className="w-4 h-4 text-tertiary" aria-label="Data Team" /></div>}
          {team.type === 'Fullstack' && <div className="p-2 bg-surface-container-highest rounded-lg"><Code className="w-4 h-4 text-on-surface" aria-label="Fullstack Team" /></div>}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Stack</p>
          <div className="flex flex-wrap gap-2">
            {team.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
          </div>
        </div>
        
        <div>
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Looking For</p>
          {team.lookingFor.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {team.lookingFor.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">Team is full</p>
          )}
        </div>

        {matchData && (
          <div className="bg-primary/5 p-3 rounded-md border border-primary/10 mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-primary uppercase">Match Score</span>
              <span className="text-sm font-bold text-primary">{matchData.score}%</span>
            </div>
            <ul className="text-xs text-on-surface-variant list-disc list-inside space-y-1">
              {matchData.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
      <div className="p-4 border-t border-outline-variant mt-auto">
        {requestStatus === 'pending' ? (
          <Button variant="secondary" className="w-full" disabled aria-label={`Request sent to ${team.name}`}>
            <Clock className="w-4 h-4 mr-2" /> Request Sent
          </Button>
        ) : requestStatus === 'accepted' ? (
          <Button variant="primary" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled aria-label={`Member of ${team.name}`}>
            <Check className="w-4 h-4 mr-2" /> Joined Team
          </Button>
        ) : (
          <Button 
            variant={team.lookingFor.length > 0 ? "primary" : "secondary"} 
            className="w-full"
            disabled={team.lookingFor.length === 0}
            onClick={() => onRequest(team.id)}
            aria-label={`Join ${team.name}`}
          >
            {team.lookingFor.length > 0 ? "Request to Join" : "View Profile"}
          </Button>
        )}
      </div>
    </Card>
  );
});
TeamCard.displayName = 'TeamCard';

export const Teams = React.memo(() => {
  const { teams, currentUser, teamRequests, sendTeamRequest } = useApp();
  const [filter, setFilter] = useState('');

  const handleRequest = useCallback((teamId: string) => {
    if (currentUser) {
      sendTeamRequest(currentUser.id, teamId);
    }
  }, [currentUser, sendTeamRequest]);

  // Efficiency: Heavy algorithmic matching is memoized and only recalculates if teams or user changes.
  const rankedTeams = useMemo(() => {
    let filteredTeams = teams;
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      filteredTeams = teams.filter(t => 
        t.name.toLowerCase().includes(lowerFilter) || 
        t.skills.some(s => s.toLowerCase().includes(lowerFilter))
      );
    }

    if (!currentUser) {
      return filteredTeams.map(team => ({ team, matchData: undefined, status: 'none' as const }));
    }

    return filteredTeams.map(team => {
      const mockCandidate = {
        id: team.id,
        role: team.lookingFor[0] || 'Any',
        skills: team.skills,
        experience: 3,
        projectInterests: [team.type]
      };
      const matchData = calculateMatchScore(currentUser, mockCandidate);
      
      const request = teamRequests.find(r => r.fromUserId === currentUser.id && r.toTeamId === team.id);
      let status: 'pending' | 'accepted' | 'declined' | 'none' = 'none';
      if (team.members.includes(currentUser.id)) status = 'accepted';
      else if (request) status = request.status;

      return { team, matchData, status };
    }).sort((a, b) => (b.matchData?.score || 0) - (a.matchData?.score || 0));
  }, [teams, currentUser, teamRequests, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Smart Team Matchmaking</h1>
          <p className="text-on-surface-variant font-body mt-1">Module 2: Algorithmic pairing based on your registered skills and goals.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <Input 
            placeholder="Search teams by name or skills..." 
            icon={<Search className="w-4 h-4" />} 
            aria-label="Search teams"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite">
        {rankedTeams.map(({ team, matchData, status }) => (
          <TeamCard 
            key={team.id} 
            team={team} 
            matchData={matchData} 
            requestStatus={status} 
            onRequest={handleRequest} 
          />
        ))}
      </div>
    </div>
  );
});
Teams.displayName = 'Teams';
