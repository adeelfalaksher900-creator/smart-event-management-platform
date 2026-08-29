/**
 * Leaderboard Logic
 */

export interface TeamEvaluation {
  teamId: string;
  teamName: string;
  projectName: string;
  score: number;
  judgedPercentage: number;
  previousRank?: number;
}

export interface RankedTeam extends TeamEvaluation {
  rank: number;
  trend: "up" | "down" | "flat";
}

/**
 * Deterministically ranks teams based on highest score first.
 * If there's a tie, falls back to highest judgedPercentage, then alphabetical by team name.
 */
export function rankTeams(teams: TeamEvaluation[]): RankedTeam[] {
  const sorted = [...teams].sort((a, b) => {
    // 1. Highest score
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // 2. Highest judged percentage
    if (b.judgedPercentage !== a.judgedPercentage) {
      return b.judgedPercentage - a.judgedPercentage;
    }
    // 3. Alphabetical tie breaker (deterministic)
    return a.teamName.localeCompare(b.teamName);
  });

  return sorted.map((team, index) => {
    const currentRank = index + 1;
    let trend: "up" | "down" | "flat" = "flat";
    
    if (team.previousRank) {
      if (currentRank < team.previousRank) trend = "up";
      else if (currentRank > team.previousRank) trend = "down";
    }

    return {
      ...team,
      rank: currentRank,
      trend
    };
  });
}
