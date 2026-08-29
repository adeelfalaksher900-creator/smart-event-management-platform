import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sanitizeText, isSafeUrl, isRateLimited } from './security';
import { calculateMatchScore } from './matchmaking';
import { calculateTotalScore } from './scoring';
import { rankTeams } from './leaderboard';
import { validateRegistration, isValidEmail } from './validation';

describe('Security Utilities', () => {
  it('sanitizeText should escape dangerous characters', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });

  it('isSafeUrl should reject dangerous protocols', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,...')).toBe(false);
    expect(isSafeUrl('https://google.com')).toBe(true);
    expect(isSafeUrl('/internal/path')).toBe(true);
  });

  it('isRateLimited should limit actions', () => {
    const id = 'test-action';
    expect(isRateLimited(id, 2, 1000)).toBe(false);
    expect(isRateLimited(id, 2, 1000)).toBe(false);
    expect(isRateLimited(id, 2, 1000)).toBe(true); // 3rd attempt should fail
  });
});

describe('Matchmaking Logic', () => {
  it('should calculate match score correctly', () => {
    const seeker = { id: '1', role: 'Frontend', skills: ['React', 'TS'], experience: 3, projectInterests: ['AI'] };
    const candidate = { id: '2', role: 'Backend', skills: ['Node', 'TS'], experience: 3, projectInterests: ['AI'] };
    
    const result = calculateMatchScore(seeker, candidate);
    expect(result.score).toBeGreaterThan(50);
    expect(result.reasons).toContain('Backend complements your Frontend role');
  });
});

describe('Scoring Logic', () => {
  it('calculateTotalScore should sum and cap correctly', () => {
    expect(calculateTotalScore({ innovation: 10, feasibility: 5, impact: 10, execution: 5, ux: 10 })).toBe(40);
    expect(calculateTotalScore({ innovation: 11, feasibility: 5, impact: -1, execution: 5, ux: 10 })).toBe(30); // 11 capped to 10, -1 capped to 0
  });
});

describe('Leaderboard Logic', () => {
  it('should rank teams deterministically', () => {
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

describe('Validation Logic', () => {
  it('validateRegistration should catch missing fields', () => {
    const result = validateRegistration({ firstName: ' ' });
    expect(result.firstName).toBe('First name is required');
    expect(result.email).toBe('Valid email is required');
  });
});
