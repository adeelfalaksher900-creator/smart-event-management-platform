/**
 * @file matchmaking.ts
 * @description Smart Matchmaking Algorithm for Team Formation
 */

export interface MatchCandidate {
  id: string;
  role: string;
  skills: string[];
  experience: number; // 1-5 scale (1=Beginner, 5=Expert)
  projectInterests: string[];
}

export interface MatchResult {
  score: number;
  sharedSkills: string[];
  complementarySkills: boolean;
  sharedInterests: string[];
  suggestedRole: string;
  reasons: string[];
}

/**
 * Calculates a deterministic compatibility score between two participants.
 *
 * @param {MatchCandidate} currentUser - The participant requesting matches.
 * @param {MatchCandidate} candidate - The candidate being evaluated.
 * @returns {MatchResult} A normalized score and explainable match factors.
 */
export function calculateMatchScore(
  currentUser: MatchCandidate,
  candidate: MatchCandidate
): MatchResult {
  const reasons: string[] = [];
  
  // Safe extraction to prevent crashes on missing data
  const currentUserSkills = currentUser.skills || [];
  const candidateSkills = candidate.skills || [];
  const currentUserInterests = currentUser.projectInterests || [];
  const candidateInterests = candidate.projectInterests || [];
  const currentUserRole = currentUser.role || 'Any';
  const candidateRole = candidate.role || 'Any';
  const currentUserExp = currentUser.experience || 3;
  const candidateExp = candidate.experience || 3;

  // Edge cases
  if (currentUser.id === candidate.id) {
    return { score: 0, sharedSkills: [], complementarySkills: false, sharedInterests: [], suggestedRole: "", reasons: ["Same participant"] };
  }

  let rawScore = 0;

  // 1. Skill Compatibility (40%)
  const set1 = new Set(currentUserSkills.map(s => s.toLowerCase()));
  const set2 = new Set(candidateSkills.map(s => s.toLowerCase()));
  
  const sharedSkills: string[] = [];
  set2.forEach(skill => {
    if (set1.has(skill)) {
      sharedSkills.push(skill);
    }
  });

  let complementarySkills = false;
  if (sharedSkills.length > 0) {
    const skillScore = Math.min((sharedSkills.length / Math.max(set1.size, 1)) * 40, 40);
    rawScore += skillScore;
    if (skillScore >= 20) {
      reasons.push(`Strong skill alignment (${sharedSkills.length} shared tools)`);
    }
  } else {
    // If no shared skills, assume complementary if they have distinct skills
    if (set1.size > 0 && set2.size > 0) {
      rawScore += 20; 
      complementarySkills = true;
      reasons.push("Complementary technical stack");
    }
  }

  // 2. Role Complementarity (25%)
  if (currentUserRole !== candidateRole && currentUserRole !== 'Any' && candidateRole !== 'Any') {
    rawScore += 25;
    reasons.push(`${candidateRole} complements your ${currentUserRole} role`);
  } else if (currentUserRole === candidateRole) {
    rawScore += 10;
    reasons.push(`Shared focus in ${currentUserRole}`);
  }

  // 3. Project Interest Similarity (20%)
  const int1 = new Set(currentUserInterests.map(i => i.toLowerCase()));
  const sharedInterests: string[] = [];
  candidateInterests.forEach(interest => {
    if (int1.has(interest.toLowerCase())) {
      sharedInterests.push(interest);
    }
  });

  if (sharedInterests.length > 0) {
    rawScore += 20;
    reasons.push(`Shared project interests (${sharedInterests.join(', ')})`);
  }

  // 4. Experience Compatibility (10%)
  const expDiff = Math.abs(currentUserExp - candidateExp);
  if (expDiff <= 1) {
    rawScore += 10;
    reasons.push("Similar experience level");
  } else if (expDiff === 2) {
    rawScore += 5;
    reasons.push("Balanced mentorship potential");
  }

  // 5. Collaboration Fit (5%)
  rawScore += 5; // Base completeness

  // Normalize
  const finalScore = Math.min(Math.round(rawScore), 100);

  return {
    score: finalScore,
    sharedSkills,
    complementarySkills,
    sharedInterests,
    suggestedRole: candidateRole,
    reasons
  };
}
