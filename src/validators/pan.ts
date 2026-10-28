export interface PANOptions {
  strict?: boolean;
}

/**
 * Validates Indian Income Tax Permanent Account Number (PAN)
 * Pattern: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
 * In strict mode: 4th character must match official entity category [ABCFGHLJPT]
 */
export function isValidPAN(pan: string, options: PANOptions = {}): boolean {
  if (!pan || typeof pan !== 'string') return false;
  const cleanPan = pan.trim().toUpperCase();

  if (options.strict) {
    const strictRegex = /^[A-Z]{3}[ABCFGHLJPT][A-Z]{1}[0-9]{4}[A-Z]{1}$/;
    return strictRegex.test(cleanPan);
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(cleanPan);
}

