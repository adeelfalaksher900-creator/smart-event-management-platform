import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Search, Filter, ShieldCheck, Cpu, Code, Paintbrush } from 'lucide-react';
import { Input } from '../components/ui/Input';

const mockTeams = [
  { id: 1, name: 'Neural Ninjas', size: 3, lookingFor: ['Frontend'], skills: ['Python', 'PyTorch', 'FastAPI'], type: 'AI' },
  { id: 2, name: 'Pixel Pioneers', size: 2, lookingFor: ['Backend', 'AI'], skills: ['React', 'Figma', 'Tailwind'], type: 'UX' },
  { id: 3, name: 'Data Drivers', size: 4, lookingFor: [], skills: ['SQL', 'd3.js', 'Go'], type: 'Data' },
  { id: 4, name: 'Solo Architect', size: 1, lookingFor: ['Design', 'Frontend', 'Backend'], skills: ['System Design'], type: 'Fullstack' },
];

export function Teams() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Team Matchmaking</h1>
          <p className="text-on-surface-variant font-body mt-1">
            Find teams looking for your skills or recruit members for your project.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">My Profile</Button>
          <Button>Create Team</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Search teams by name or skills..." 
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button variant="secondary" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeams.map(team => (
          <Card key={team.id} className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{team.name}</CardTitle>
                  <p className="text-sm text-on-surface-variant mt-1">{team.size}/4 Members</p>
                </div>
                {team.type === 'AI' && <div className="p-2 bg-primary/10 rounded-lg"><Cpu className="w-4 h-4 text-primary" /></div>}
                {team.type === 'UX' && <div className="p-2 bg-secondary/10 rounded-lg"><Paintbrush className="w-4 h-4 text-secondary" /></div>}
                {team.type === 'Data' && <div className="p-2 bg-tertiary/10 rounded-lg"><ShieldCheck className="w-4 h-4 text-tertiary" /></div>}
                {team.type === 'Fullstack' && <div className="p-2 bg-surface-container-highest rounded-lg"><Code className="w-4 h-4 text-on-surface" /></div>}
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Stack</p>
                <div className="flex flex-wrap gap-2">
                  {team.skills.map(s => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Looking For</p>
                {team.lookingFor.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {team.lookingFor.map(s => (
                      <Badge key={s} variant="outline">{s}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant">Team is full</p>
                )}
              </div>
            </CardContent>
            <div className="p-4 border-t border-outline-variant mt-auto">
              <Button 
                variant={team.lookingFor.length > 0 ? "primary" : "secondary"} 
                className="w-full"
                disabled={team.lookingFor.length === 0}
              >
                {team.lookingFor.length > 0 ? "Request to Join" : "View Profile"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
