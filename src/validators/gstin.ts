/**
 * Validates Indian Goods and Services Tax Identification Number (GSTIN)
 * Format: 2 digits (State Code) + 10 chars (PAN) + 1 digit (Entity code) + 'Z' + 1 checksum char
 */
export function isValidGSTIN(gstin: string): boolean {
  if (!gstin || typeof gstin !== 'string') return false;
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.trim().toUpperCase());
}

