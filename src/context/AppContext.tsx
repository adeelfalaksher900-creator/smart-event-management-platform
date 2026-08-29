/**
 * @file AppContext.tsx
 * @description Global state management simulating backend database operations.
 * Utilizes useMemo and useCallback heavily for performance optimization.
 */
import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';
import { sanitizeText } from '../utils/security';
import type { MatchCandidate } from '../utils/matchmaking';
import { useMockRealtime } from '../hooks/useMockRealtime';

// ---------------------------------------------------------------------------
// 1. Types & Interfaces (Data Models)
// ---------------------------------------------------------------------------
export type User = MatchCandidate & { 
  name: string; 
  email: string; 
  qrCode?: string;
  checkInStatus?: boolean;
  checkInTime?: string;
};

export type TeamRequest = {
  id: string;
  fromUserId: string;
  toTeamId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
};

export type Team = { id: string; name: string; size: number; lookingFor: string[]; skills: string[]; type: string; members: string[] };
export type Announcement = { id: string; title: string; content: string; time: string; type: 'urgent' | 'info' | 'announcement'; author: string };
export type Submission = { id: string; teamId: string; projectName: string; description: string; url: string };
export type Score = { id: string; submissionId: string; judgeId: string; total: number; breakdown: Record<string, number>; feedback?: string };

interface AppState {
  users: User[];
  teams: Team[];
  announcements: Announcement[];
  submissions: Submission[];
  scores: Score[];
  teamRequests: TeamRequest[];
  currentUser: User | null;
  judgeAssignments: Record<string, string[]>; // judgeId -> submissionIds
}

interface AppContextType extends AppState {
  registerUser: (user: Omit<User, 'id' | 'qrCode' | 'checkInStatus' | 'checkInTime'>) => void;
  checkInUser: (userId: string) => boolean;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'time'>) => void;
  submitScore: (score: Omit<Score, 'id'>) => void;
  sendTeamRequest: (fromUserId: string, toTeamId: string) => void;
  setCurrentUser: (user: User | null) => void;
}

// ---------------------------------------------------------------------------
// 2. Mock Initial Data
// ---------------------------------------------------------------------------
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex L.', email: 'alex@example.com', role: 'Participant', skills: ['React', 'TypeScript'], experience: 4, projectInterests: ['AI', 'UX'] },
  { id: 'u2', name: 'Sarah M.', email: 'sarah@example.com', role: 'Participant', skills: ['Python', 'FastAPI'], experience: 3, projectInterests: ['Data', 'AI'] },
  { id: 'j1', name: 'Judge Judy', email: 'judge@eventos.com', role: 'Judge', skills: [], experience: 5, projectInterests: [] }
];

const MOCK_TEAMS: Team[] = [
  { id: 't1', name: 'Neural Ninjas', size: 3, lookingFor: ['Frontend'], skills: ['Python', 'PyTorch'], type: 'AI', members: ['u2'] },
  { id: 't2', name: 'Pixel Pioneers', size: 2, lookingFor: ['Backend', 'AI'], skills: ['React', 'Figma'], type: 'UX', members: ['u1'] },
  { id: 't3', name: 'Data Drivers', size: 4, lookingFor: [], skills: ['SQL', 'd3.js'], type: 'Data', members: [] },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'Hacking phase officially begins!', content: 'Welcome to Prompt Wars 2026. Get building!', time: new Date(Date.now() - 3600000).toISOString(), type: 'announcement', author: 'Organizer System' },
];

const MOCK_SUBMISSIONS: Submission[] = [
  { id: 's1', teamId: 't1', projectName: 'AutoPrompt Gen', description: 'AI driven prompt generation.', url: 'https://github.com/test/1' },
  { id: 's2', teamId: 't2', projectName: 'Figma to Code Agent', description: 'Design to code via AI.', url: 'https://github.com/test/2' },
];

const MOCK_SCORES: Score[] = [
  { id: 'sc1', submissionId: 's1', judgeId: 'j1', total: 45, breakdown: { innovation: 9, feasibility: 9, impact: 9, execution: 9, ux: 9 } }
];

const MOCK_JUDGE_ASSIGNMENTS: Record<string, string[]> = {
  'j1': ['s1', 's2', 's3'] // Judge j1 can see all these submissions
};

// ---------------------------------------------------------------------------
// 3. Context Initialization & Provider
// ---------------------------------------------------------------------------
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [scores, setScores] = useState<Score[]>(MOCK_SCORES);
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [judgeAssignments, setJudgeAssignments] = useState(MOCK_JUDGE_ASSIGNMENTS);
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);

  // Handle Mock Realtime Events
  const handleRealtimeEvent = useCallback((event: { type: string; payload: any }) => {
    switch(event.type) {
      case 'NEW_ANNOUNCEMENT':
        setAnnouncements(prev => [{
          id: `a${Date.now()}`,
          time: new Date().toISOString(),
          ...event.payload
        }, ...prev]);
        break;
      case 'NEW_SUBMISSION':
        setSubmissions(prev => [...prev, { id: `s${Date.now()}`, description: 'Realtime submission', url: '', ...event.payload }]);
        // Automatically assign new submission to j1 for demo
        setJudgeAssignments(prev => ({...prev, 'j1': [...(prev['j1'] || []), `s${Date.now()}`]}));
        break;
      // Other events could go here
    }
  }, []);

  useMockRealtime(handleRealtimeEvent, 45000); // Trigger every 45s so it doesn't spam

  // Methods
  const registerUser = useCallback((user: Omit<User, 'id' | 'qrCode' | 'checkInStatus' | 'checkInTime'>) => {
    const newId = `u${Date.now()}`;
    const newUser: User = {
      ...user,
      id: newId,
      qrCode: `QR_HASH_${btoa(user.email).substring(0, 10)}_${newId}`,
      checkInStatus: false
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser); // Auto-login for demo purposes
  }, []);

  const checkInUser = useCallback((userId: string) => {
    let success = false;
    setUsers(prev => prev.map(u => {
      if (u.id === userId && !u.checkInStatus) {
        success = true;
        return { ...u, checkInStatus: true, checkInTime: new Date().toISOString() };
      }
      return u;
    }));
    return success;
  }, []);

  const addAnnouncement = useCallback((ann: Omit<Announcement, 'id' | 'time'>) => {
    const safeContent = sanitizeText(ann.content);
    const safeTitle = sanitizeText(ann.title);
    setAnnouncements(prev => [{
      ...ann,
      id: `a${Date.now()}`,
      time: new Date().toISOString(),
      content: safeContent,
      title: safeTitle
    }, ...prev]);
  }, []);

  const submitScore = useCallback((score: Omit<Score, 'id'>) => {
    setScores(prev => {
      // Prevent duplicates from same judge for same submission
      if (prev.some(s => s.judgeId === score.judgeId && s.submissionId === score.submissionId)) {
        return prev;
      }
      const safeFeedback = sanitizeText(score.feedback);
      return [...prev, { ...score, feedback: safeFeedback, id: `sc${Date.now()}` }];
    });
  }, []);

  const sendTeamRequest = useCallback((fromUserId: string, toTeamId: string) => {
    setTeamRequests(prev => {
      if (prev.some(req => req.fromUserId === fromUserId && req.toTeamId === toTeamId)) return prev;
      return [...prev, { id: `tr${Date.now()}`, fromUserId, toTeamId, status: 'pending', timestamp: new Date().toISOString() }];
    });
  }, []);

  const value = useMemo(() => ({
    users, teams, announcements, submissions, scores, teamRequests, judgeAssignments, currentUser,
    registerUser, checkInUser, addAnnouncement, submitScore, sendTeamRequest, setCurrentUser
  }), [users, teams, announcements, submissions, scores, teamRequests, judgeAssignments, currentUser, registerUser, checkInUser, addAnnouncement, submitScore, sendTeamRequest]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
