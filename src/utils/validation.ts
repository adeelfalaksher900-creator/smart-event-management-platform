/**
 * Input Validation Utilities
 */

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateRegistration(data: any): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (!data.firstName?.trim()) errors.firstName = "First name is required";
  if (!data.lastName?.trim()) errors.lastName = "Last name is required";
  if (!data.email?.trim() || !isValidEmail(data.email)) errors.email = "Valid email is required";
  if (!data.role?.trim()) errors.role = "Role is required";
  
  return errors;
}
