/**
 * Judging & Scoring Logic
 */

export interface EvaluationScores {
  innovation: number;
  feasibility: number;
  impact: number;
  execution: number;
  ux: number;
}

export function calculateTotalScore(scores: EvaluationScores): number {
  const { innovation, feasibility, impact, execution, ux } = scores;
  
  // Validate ranges (0-10) and finite numbers
  const validate = (val: number) => {
    if (typeof val !== 'number' || !Number.isFinite(val) || Number.isNaN(val)) return 0;
    return Math.max(0, Math.min(10, val));
  };

  const total = 
    validate(innovation) + 
    validate(feasibility) + 
    validate(impact) + 
    validate(execution) + 
    validate(ux);
    
  return total;
}
