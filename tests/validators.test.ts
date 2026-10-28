import { describe, it, expect } from 'vitest';
import {
  isValidPAN,
  isValidGSTIN,
  isValidIndianPhone,
  formatIndianNumber,
} from '../src';

describe('validators & number formatting', () => {
  describe('isValidPAN', () => {
    it('validates standard PAN formats', () => {
      expect(isValidPAN('ABCDE1234F')).toBe(true);
      expect(isValidPAN('abcde1234f')).toBe(true);
    });

    it('rejects invalid PAN strings', () => {
      expect(isValidPAN('12345ABCDE')).toBe(false);
      expect(isValidPAN('')).toBe(false);
      expect(isValidPAN('ABCDE12345')).toBe(false);
    });

    it('validates strict entity type when enabled', () => {
      expect(isValidPAN('ABCPE1234F', { strict: true })).toBe(true);
      expect(isValidPAN('ABCDE1234F', { strict: true })).toBe(false);
    });
  });

  describe('isValidGSTIN', () => {
    it('validates standard GSTIN', () => {
      expect(isValidGSTIN('27ABCDE1234F1Z5')).toBe(true);
      expect(isValidGSTIN('29ABCDE1234F2Z5')).toBe(true);
    });

    it('rejects invalid GSTIN', () => {
      expect(isValidGSTIN('invalid-gstin')).toBe(false);
      expect(isValidGSTIN('')).toBe(false);
    });
  });

  describe('isValidIndianPhone', () => {
    it('validates valid phone numbers in different formats', () => {
      expect(isValidIndianPhone('9876543210')).toBe(true);
      expect(isValidIndianPhone('+91 98765 43210')).toBe(true);
      expect(isValidIndianPhone('+919876543210')).toBe(true);
      expect(isValidIndianPhone('09876543210')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(isValidIndianPhone('1234567890')).toBe(false);
      expect(isValidIndianPhone('')).toBe(false);
      expect(isValidIndianPhone('abc')).toBe(false);
    });
  });

  describe('formatIndianNumber', () => {
    it('formats pure numbers with Indian comma separation', () => {
      expect(formatIndianNumber(1234567)).toBe('12,34,567');
      expect(formatIndianNumber(1234567.89)).toBe('12,34,567.89');
      expect(formatIndianNumber(500)).toBe('500');
      expect(formatIndianNumber(100000)).toBe('1,00,000');
    });

    it('formats numbers with custom decimals', () => {
      expect(formatIndianNumber(1234567, 2)).toBe('12,34,567.00');
      expect(formatIndianNumber(1234567.894, 2)).toBe('12,34,567.89');
    });
  });
});

