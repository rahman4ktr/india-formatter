/**
 * Validates Indian Mobile Numbers
 * Accepts 10 digits starting with 6-9, with optional +91, 91, or 0 prefixes and spaces/hyphens
 */
export function isValidIndianPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  // Cleans spaces, brackets, and dashes
  const clean = phone.replace(/[\s\-()]/g, '');
  const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6-9]\d{9}$/;
  return phoneRegex.test(clean);
}

