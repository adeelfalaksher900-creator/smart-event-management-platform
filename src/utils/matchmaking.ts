/**
 * Smart Team Matchmaking Logic
 */

export interface MatchCandidate {
  id: string;
  role: string;
  skills: string[];
  experience: number; // 1-5 scale (1=Beginner, 5=Expert)
  projectInterests: string[];
}

/**
 * Calculates a match score between 0-100 based on the specified weights:
 * Skill Compatibility: 40%
 * Role Complementarity: 25%
 * Project Interest: 20%
 * Experience: 10%
 * Collaboration/Profile Fit: 5% (Base/Bonus)
 */
export function calculateMatchScore(
  seeker: MatchCandidate,
  candidate: MatchCandidate
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Skill Compatibility (40%)
  // Find complementary skills rather than exact overlap if roles are different,
  // or exact overlap if roles are the same. For simplicity, we calculate shared/complementary.
  const seekerSkills = new Set(seeker.skills.map(s => s.toLowerCase()));
  const candidateSkills = new Set(candidate.skills.map(s => s.toLowerCase()));
  
  let sharedSkills = 0;
  candidateSkills.forEach(skill => {
    if (seekerSkills.has(skill)) sharedSkills++;
  });
  
  if (sharedSkills > 0) {
    // Both have similar technical context
    const skillScore = Math.min((sharedSkills / Math.max(seekerSkills.size, 1)) * 40, 40);
    score += skillScore;
    if (skillScore > 20) {
      reasons.push(`Strong skill alignment (${sharedSkills} shared tools)`);
    }
  } else {
    // Complementary stack assumption if they don't overlap much
    score += 20; // Base score for diverse stack
    reasons.push("Complementary technical stack");
  }

  // 2. Role Complementarity (25%)
  if (seeker.role !== candidate.role) {
    score += 25;
    reasons.push(`${candidate.role} complements your ${seeker.role} role`);
  } else {
    score += 10;
    reasons.push(`Shared focus in ${seeker.role}`);
  }

  // 3. Project Interest Similarity (20%)
  const seekerInterests = new Set(seeker.projectInterests.map(i => i.toLowerCase()));
  let sharedInterests = 0;
  candidate.projectInterests.forEach(interest => {
    if (seekerInterests.has(interest.toLowerCase())) sharedInterests++;
  });
  
  if (sharedInterests > 0) {
    score += 20;
    reasons.push("Shared project interests");
  }

  // 4. Experience Compatibility (10%)
  // Prefer similar experience levels
  const expDiff = Math.abs(seeker.experience - candidate.experience);
  if (expDiff <= 1) {
    score += 10;
    reasons.push("Similar experience level");
  } else if (expDiff === 2) {
    score += 5;
    reasons.push("Balanced mentorship potential");
  }

  // 5. Collaboration Fit (5%)
  // Base bonus for completeness
  score += 5;

  return {
    score: Math.min(Math.round(score), 100),
    reasons
  };
}
