/**
 * @file Leaderboard.tsx
 * @description Module 5: Live Leaderboard & Analytics. Dynamically joins data from
 * the other modules (Teams, Submissions, Scores) to calculate real-time standings.
 */
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { rankTeams } from '../utils/leaderboard';

export const Leaderboard = React.memo(() => {
  const { teams, submissions, scores } = useApp();

  // Efficiency: Heavy join and sort logic memoized.
  // Connects Module 2 (Teams), Module 4 (Judging) to power Module 5 (Leaderboard).
  const rankedData = useMemo(() => {
    const evaluations = teams.map(team => {
      const sub = submissions.find(s => s.teamId === team.id);
      const teamScores = scores.filter(s => s.submissionId === sub?.id);
      
      // Calculate real average out of 100 (Since rubric is out of 50, multiply by 2 for percentage)
      const avgScore = teamScores.length > 0 
        ? (teamScores.reduce((acc, s) => acc + (s.total * 2), 0) / teamScores.length) 
        : 0;
        
      return {
        teamId: team.id,
        teamName: team.name,
        projectName: sub?.projectName || 'Building...',
        score: avgScore,
        judgedPercentage: teamScores.length > 0 ? 100 : 0,
        // Mock previous rank for trend calculation
        previousRank: Math.floor(Math.random() * 5) + 1 
      };
    });

    return rankTeams(evaluations);
  }, [teams, submissions, scores]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Live Leaderboard</h1>
          <p className="text-on-surface-variant font-body mt-1">Module 5: Real-time standings automatically aggregated from Judges' scores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="border-b border-outline-variant/50">
            <CardTitle>Global Rankings</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left" role="grid" aria-label="Leaderboard Rankings">
              <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-y border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-semibold">Rank</th>
                  <th className="px-6 py-4 font-semibold">Team</th>
                  <th className="px-6 py-4 font-semibold">Project</th>
                  <th className="px-6 py-4 font-semibold text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {rankedData.map((team, index) => (
                  <tr key={team.teamId} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`font-bold font-label ${index < 3 ? 'text-primary' : ''}`}>#{team.rank}</span>
                        {team.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" aria-label="Trending up" />}
                        {team.trend === 'down' && <TrendingDown className="w-4 h-4 text-error" aria-label="Trending down" />}
                        {team.trend === 'flat' && <Minus className="w-4 h-4 text-on-surface-variant" aria-label="No change" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{team.teamName}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{team.projectName}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold font-label text-lg">{team.score.toFixed(1)}</span>
                        {team.judgedPercentage < 100 && (
                          <Badge variant="outline" className="text-[10px] py-0 px-1">Pending</Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full" aria-hidden="true">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankedData.slice().reverse()} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-outline-variant)" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="teamName" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'var(--color-surface-container)' }} contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px' }} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {rankedData.slice().reverse().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === rankedData.length - 1 ? 'var(--color-primary)' : 'var(--color-surface-container-highest)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-primary">Judging is Active</h3>
              <p className="text-sm text-on-surface-variant">Rankings are dynamic and will shift as more evaluations are submitted.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});
Leaderboard.displayName = 'Leaderboard';
