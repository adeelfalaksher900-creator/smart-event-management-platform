import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const mockLeaderboard = [
  { id: 1, rank: 1, team: "Neural Ninjas", score: 94.5, trend: "up", project: "AutoPrompt Gen", judged: 100 },
  { id: 2, rank: 2, team: "Quantum UX", score: 92.0, trend: "flat", project: "Figma to Code Agent", judged: 100 },
  { id: 3, rank: 3, team: "Data Drivers", score: 89.5, trend: "up", project: "Live Sync DB", judged: 100 },
  { id: 4, rank: 4, team: "Solo Architect", score: 88.0, trend: "down", project: "Micro-framework", judged: 100 },
  { id: 5, rank: 5, team: "Pixel Pioneers", score: 85.5, trend: "flat", project: "AI Color Palettes", judged: 80 },
];

export function Leaderboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Live Leaderboard</h1>
          <p className="text-on-surface-variant font-body mt-1">
            Real-time standings based on aggregated judge scores.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Leaderboard Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Teams</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-y border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-semibold">Rank</th>
                  <th className="px-6 py-4 font-semibold">Team</th>
                  <th className="px-6 py-4 font-semibold">Project</th>
                  <th className="px-6 py-4 font-semibold text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {mockLeaderboard.map((team, index) => (
                  <tr key={team.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`font-bold font-label ${index < 3 ? 'text-primary' : ''}`}>
                          #{team.rank}
                        </span>
                        {team.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {team.trend === 'down' && <TrendingDown className="w-4 h-4 text-error" />}
                        {team.trend === 'flat' && <Minus className="w-4 h-4 text-on-surface-variant" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {team.team}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {team.project}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold font-label text-lg">{team.score.toFixed(1)}</span>
                        {team.judged < 100 && (
                          <Badge variant="outline" className="text-[10px] py-0">
                            {team.judged}% judged
                          </Badge>
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
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockLeaderboard.slice().reverse()} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-outline-variant)" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="team" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: 'var(--color-surface-container)' }}
                      contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {mockLeaderboard.slice().reverse().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === mockLeaderboard.length - 1 ? 'var(--color-primary)' : 'var(--color-surface-container-highest)'} />
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
              <h3 className="font-bold text-lg mb-2 text-primary">Judging is 85% Complete</h3>
              <p className="text-sm text-on-surface-variant">Final results will be locked at 18:00 EST. Rankings may shift.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
