import { describe, it, expect } from 'vitest';
import { sanitizeText, isSafeUrl, isRateLimited, verifyQrPayload, canAccessRole, isJudgeAssignedToSubmission } from './security';
import { calculateMatchScore } from './matchmaking';
import { calculateTotalScore } from './scoring';
import { rankTeams } from './leaderboard';
import { validateRegistration, isValidEmail } from './validation';

describe('Security & XSS', () => {
  it('sanitizeText should escape dangerous characters', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(sanitizeText('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;');
    expect(sanitizeText('<svg onload=alert(1)>')).toBe('&lt;svg onload=alert(1)&gt;');
    expect(sanitizeText('javascript:alert(1)')).toBe('javascript:alert(1)');
  });

  it('isSafeUrl should reject dangerous protocols', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,...')).toBe(false);
    expect(isSafeUrl('vbscript:msgbox("hello")')).toBe(false);
    expect(isSafeUrl('https://google.com')).toBe(true);
    expect(isSafeUrl('http://insecure.com')).toBe(true);
    expect(isSafeUrl('/internal/path')).toBe(true);
  });

  it('isRateLimited should limit actions', () => {
    const id = 'test-action';
    expect(isRateLimited(id, 2, 1000)).toBe(false);
    expect(isRateLimited(id, 2, 1000)).toBe(false);
    expect(isRateLimited(id, 2, 1000)).toBe(true); // 3rd attempt should fail
  });
});

describe('RBAC & IDOR (Role Security)', () => {
  it('canAccessRole handles array of roles and exact roles', () => {
    expect(canAccessRole('participant', 'participant')).toBe(true);
    expect(canAccessRole('participant', 'judge')).toBe(false);
    expect(canAccessRole('judge', ['judge', 'organizer'])).toBe(true);
    expect(canAccessRole('participant', ['judge', 'organizer'])).toBe(false);
  });

  it('isJudgeAssignedToSubmission enforces assignment', () => {
    const assignments = { 'j1': ['s1', 's2'] };
    expect(isJudgeAssignedToSubmission('j1', 's1', assignments)).toBe(true);
    expect(isJudgeAssignedToSubmission('j1', 's3', assignments)).toBe(false);
    expect(isJudgeAssignedToSubmission('j2', 's1', assignments)).toBe(false); // Unknown judge
  });
});

describe('QR Verification & Check-in', () => {
  it('verifyQrPayload validates payload integrity', () => {
    const pIds = ['u1', 'u2'];
    expect(verifyQrPayload('QR_HASH_abcd_u1', pIds).success).toBe(true);
    expect(verifyQrPayload('QR_HASH_abcd_u99', pIds).success).toBe(false);
    expect(verifyQrPayload('MALFORMED_u1', pIds).success).toBe(false);
  });
});

describe('Smart Team Formation Algorithm', () => {
  it('calculates deterministic match score', () => {
    const seeker = { id: '1', role: 'Frontend', skills: ['React', 'TS'], experience: 3, projectInterests: ['AI'] };
    const candidate = { id: '2', role: 'Backend', skills: ['Node', 'TS'], experience: 3, projectInterests: ['AI'] };
    
    const result = calculateMatchScore(seeker, candidate);
    expect(result.score).toBeGreaterThan(50);
    expect(result.reasons.some(r => r.includes('complements your Frontend'))).toBe(true);
    expect(result.sharedSkills).toContain('ts');
  });

  it('prevents matching self', () => {
    const p = { id: '1', role: 'Any', skills: [], experience: 3, projectInterests: [] };
    const result = calculateMatchScore(p, p);
    expect(result.score).toBe(0);
    expect(result.reasons).toContain('Same participant');
  });

  it('handles missing arrays gracefully', () => {
    const p1 = { id: '1', role: 'A', skills: [], experience: 3, projectInterests: [] };
    const p2 = { id: '2', role: 'B', skills: [], experience: 3, projectInterests: [] };
    const result = calculateMatchScore(p1, p2);
    expect(result.score).toBeGreaterThan(0); // Roles complement, base score added
  });
});

describe('Judging Logic', () => {
  it('calculateTotalScore sums and caps accurately', () => {
    expect(calculateTotalScore({ innovation: 10, feasibility: 5, impact: 10, execution: 5, ux: 10 })).toBe(40);
    expect(calculateTotalScore({ innovation: 11, feasibility: 5, impact: -1, execution: 5, ux: 10 })).toBe(30); 
    expect(calculateTotalScore({ innovation: NaN, feasibility: Infinity, impact: 5, execution: 5, ux: 5 })).toBe(15);
  });
});

describe('Leaderboard Derivation', () => {
  it('ranks teams deterministically handling ties', () => {
    const teams = [
      { teamId: '1', teamName: 'Beta', projectName: 'A', score: 90, judgedPercentage: 100 },
      { teamId: '2', teamName: 'Alpha', projectName: 'B', score: 90, judgedPercentage: 100 },
      { teamId: '3', teamName: 'Gamma', projectName: 'C', score: 95, judgedPercentage: 100 },
    ];
    
    const ranked = rankTeams(teams);
    expect(ranked[0].teamName).toBe('Gamma'); // highest score
    expect(ranked[1].teamName).toBe('Alpha'); // tie broken by name
    expect(ranked[2].teamName).toBe('Beta');
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
  });
});

describe('Registration & Validation', () => {
  it('validateRegistration enforces fields', () => {
    const result = validateRegistration({ firstName: ' ' });
    expect(result.firstName).toBe('First name is required');
    expect(result.email).toBe('Valid email is required');
  });

  it('isValidEmail enforces email pattern', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });
});
