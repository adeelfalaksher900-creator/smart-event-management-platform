/**
 * @file Judging.tsx
 * @description Module 4: Interactive Judging Portal. Integrates with the scoring logic
 * and writes directly to the global scores state. Enforces RBAC and IDOR.
 */
import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { calculateTotalScore } from '../utils/scoring';
import { isJudgeAssignedToSubmission, canAccessRole } from '../utils/security';
import type { UserRole } from '../components/layout/AppShell';
import { Github, Play, CheckCircle, Lock } from 'lucide-react';

export const Judging = React.memo(() => {
  const { submissions, scores, submitScore, currentUser, judgeAssignments } = useApp();
  const role: UserRole = (localStorage.getItem('eventos_role') as UserRole) || 'participant';
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  
  // Scoring state
  const [rubric, setRubric] = useState({ innovation: 5, feasibility: 5, impact: 5, execution: 5, ux: 5 });
  const [feedback, setFeedback] = useState({ strengths: '', technical: '', improvements: '', overall: '' });

  // Security: Prevent rendering if not a judge or organizer
  const isAuthorized = canAccessRole(role, ['judge', 'organizer']);

  // Filter queue securely: only show assigned ones or all for organizer
  const assignedQueue = useMemo(() => {
    if (role === 'organizer') return submissions;
    if (!currentUser) return [];
    return submissions.filter(sub => isJudgeAssignedToSubmission(currentUser.id, sub.id, judgeAssignments));
  }, [submissions, currentUser, judgeAssignments, role]);

  const activeSubmission = useMemo(() => 
    assignedQueue.find(s => s.id === selectedSubId), 
  [assignedQueue, selectedSubId]);

  const scoredSubIds = useMemo(() => 
    new Set(scores.map(s => s.submissionId)), 
  [scores]);

  const handleScoreChange = useCallback((key: string, val: string) => {
    setRubric(prev => ({ ...prev, [key]: Number(val) }));
  }, []);

  const handleFeedbackChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const totalCalculatedScore = useMemo(() => calculateTotalScore(rubric), [rubric]);

  const handleSubmitScore = useCallback(() => {
    if (!activeSubmission) return;
    
    // Security verification right before submit
    if (role !== 'organizer' && !isJudgeAssignedToSubmission(currentUser?.id || '', activeSubmission.id, judgeAssignments)) {
      alert("Unauthorized: You are not assigned to this submission.");
      return;
    }

    const combinedFeedback = `Strengths: ${feedback.strengths}\nTechnical: ${feedback.technical}\nImprovements: ${feedback.improvements}\nOverall: ${feedback.overall}`;

    submitScore({
      submissionId: activeSubmission.id,
      judgeId: currentUser?.id || 'guest-judge',
      total: totalCalculatedScore,
      breakdown: { ...rubric },
      feedback: combinedFeedback
    });
    setSelectedSubId(null); 
    setRubric({ innovation: 5, feasibility: 5, impact: 5, execution: 5, ux: 5 });
    setFeedback({ strengths: '', technical: '', improvements: '', overall: '' });
  }, [activeSubmission, submitScore, currentUser, totalCalculatedScore, rubric, feedback, role, judgeAssignments]);

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="p-4 bg-error/10 text-error rounded-full"><Lock className="w-12 h-12" /></div>
        <h2 className="text-2xl font-bold font-headline">Access Restricted</h2>
        <p className="text-on-surface-variant font-body">You do not have the required role to access the Judging Portal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Interactive Judging Portal</h1>
          <p className="text-on-surface-variant font-body mt-1">Module 4: Evaluate assigned submissions systematically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>My Evaluation Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignedQueue.length === 0 && (
              <p className="text-sm text-on-surface-variant text-center py-4">No projects assigned.</p>
            )}
            {assignedQueue.map(sub => {
              const isScored = scoredSubIds.has(sub.id);
              return (
                <div 
                  key={sub.id} 
                  onClick={() => !isScored && setSelectedSubId(sub.id)}
                  className={`p-4 rounded-lg border transition-all ${
                    isScored ? 'bg-surface-container-lowest border-transparent opacity-60 cursor-not-allowed' : 
                    selectedSubId === sub.id ? 'bg-primary/10 border-primary cursor-pointer' : 
                    'bg-surface-container border-outline-variant cursor-pointer hover:border-primary/50'
                  }`}
                  role="button"
                  tabIndex={isScored ? -1 : 0}
                  aria-label={`Evaluate ${sub.projectName}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{sub.projectName}</h4>
                    {isScored && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{sub.description}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {activeSubmission ? (
            <div className="flex flex-col h-full">
              <CardHeader className="border-b border-outline-variant pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-2">Evaluating: {activeSubmission.teamId}</Badge>
                    <CardTitle className="text-2xl">{activeSubmission.projectName}</CardTitle>
                    <p className="text-on-surface-variant mt-2">{activeSubmission.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" aria-label="View Source"><Github className="w-4 h-4 mr-2"/> Source</Button>
                    <Button variant="primary" size="sm" aria-label="Live Demo"><Play className="w-4 h-4 mr-2"/> Demo</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Rubric column */}
                  <div className="space-y-6">
                    <h3 className="font-semibold text-lg border-b border-outline-variant pb-2">Scoring Rubric</h3>
                    {Object.keys(rubric).map((key) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <label htmlFor={key} className="text-sm font-medium capitalize">{key}</label>
                          <span className="text-sm font-bold font-label text-primary">{rubric[key as keyof typeof rubric]}/10</span>
                        </div>
                        <input 
                          id={key}
                          type="range" 
                          min="0" max="10" step="1" 
                          value={rubric[key as keyof typeof rubric]} 
                          onChange={(e) => handleScoreChange(key, e.target.value)}
                          className="w-full accent-primary"
                          aria-label={`${key} Score`}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Feedback column */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b border-outline-variant pb-2">Structured Feedback</h3>
                    {['strengths', 'technical', 'improvements', 'overall'].map(fKey => (
                      <div key={fKey}>
                        <label htmlFor={fKey} className="text-xs font-medium capitalize block mb-1 text-on-surface-variant">{fKey}</label>
                        <textarea
                          id={fKey}
                          name={fKey}
                          value={feedback[fKey as keyof typeof feedback]}
                          onChange={handleFeedbackChange}
                          className="w-full text-sm p-2 rounded border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none h-20"
                          placeholder={`Enter ${fKey} feedback...`}
                          aria-label={`${fKey} feedback`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <div className="p-6 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between rounded-b-xl">
                <div>
                  <p className="text-sm text-on-surface-variant">Total Evaluated Score</p>
                  <p className="text-4xl font-bold font-display tracking-tighter text-primary">{totalCalculatedScore}<span className="text-lg text-on-surface-variant">/50</span></p>
                </div>
                <Button size="lg" onClick={handleSubmitScore} aria-label="Submit Final Evaluation" disabled={!feedback.overall.trim()}>
                  Submit Evaluation
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-on-surface-variant p-8 text-center">
              <CheckCircle className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">Ready for Evaluation</h3>
              <p>Select a pending project from the queue to load the judging rubric.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
});
Judging.displayName = 'Judging';
