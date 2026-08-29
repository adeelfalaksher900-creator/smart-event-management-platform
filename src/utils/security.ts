/**
 * XSS Prevention and Security Utilities
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

// Safe URL validation
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
