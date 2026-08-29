/**
 * @file security.ts
 * @description XSS Prevention, RBAC, Validation, IDOR Protection, and Security Utilities.
 * Contains pure functions for secure business logic.
 */

// Basic HTML sanitization to prevent XSS in user-provided text
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validates a URL to ensure it uses safe protocols.
 * Blocks javascript:, data:, vbscript:, etc.
 * @param url The URL to check
 * @returns true if safe, false otherwise
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    // If it doesn't parse as a full URL, check if it's a safe relative path
    if (url.startsWith("/") && !url.startsWith("//")) return true;
    return false;
  }
}

/**
 * Rate Limiting Simulation
 * Tracks timestamps in memory for demonstration purposes.
 * @param actionId Unique identifier for the user/action
 * @param limit Max actions allowed
 * @param windowMs Time window in milliseconds
 */
const rateLimits: Record<string, number[]> = {};
export function isRateLimited(actionId: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (!rateLimits[actionId]) {
    rateLimits[actionId] = [];
  }
  
  // Clean up old entries
  rateLimits[actionId] = rateLimits[actionId].filter(time => now - time < windowMs);
  
  if (rateLimits[actionId].length >= limit) {
    return true; // Rate limited
  }
  
  // Add current action
  rateLimits[actionId].push(now);
  return false;
}

/**
 * Role-Based Access Control (RBAC) - verifies if user role has access to specific resources
 */
export type Role = 'participant' | 'judge' | 'organizer' | null;

export function canAccessRole(currentRole: Role, requiredRole: Role | Role[]): boolean {
  if (!currentRole) return false;
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(currentRole);
  }
  return currentRole === requiredRole;
}

/**
 * IDOR Protection - verifies ownership or assignment
 */
export function isJudgeAssignedToSubmission(judgeId: string, submissionId: string, assignments: Record<string, string[]>): boolean {
  if (!judgeId || !submissionId || !assignments) return false;
  const judgeAssignments = assignments[judgeId];
  if (!judgeAssignments) return false;
  return judgeAssignments.includes(submissionId);
}

/**
 * QR Verification Logic
 */
export type QrVerificationResult = {
  success: boolean;
  reason?: string;
  participantId?: string;
};

export function verifyQrPayload(payload: string, participantIds: string[]): QrVerificationResult {
  if (!payload || typeof payload !== 'string') return { success: false, reason: "Malformed payload" };
  
  const parts = payload.split('_');
  if (parts.length < 3 || parts[0] !== 'QR' || parts[1] !== 'HASH') {
    return { success: false, reason: "Invalid verification value" };
  }
  
  const idFromPayload = parts[parts.length - 1];
  
  if (!participantIds.includes(idFromPayload)) {
    return { success: false, reason: "Unknown participant" };
  }
  
  return { success: true, participantId: idFromPayload };
}
