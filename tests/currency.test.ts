import { describe, it, expect } from 'vitest';
import {
  formatINR,
  formatINRCompact,
  toWordsINR,
  isValidPAN,
  isValidGSTIN,
  isValidIndianPhone,
} from '../src';

describe('india-formatter', () => {
  it('correctly formats INR with Indian commas', () => {
    expect(formatINR(1234567.89)).toBe('₹12,34,567.89');
    expect(formatINR(500, { showSymbol: false })).toBe('500.00');
  });

  it('converts numbers to Indian English words', () => {
    expect(toWordsINR(125000)).toBe('One Lakh Twenty Five Thousand Rupees Only');
    expect(toWordsINR(500.5)).toBe('Five Hundred Rupees and Fifty Paise Only');
  });

  it('validates PAN and GSTIN', () => {
    expect(isValidPAN('ABCDE1234F')).toBe(true);
    expect(isValidPAN('12345ABCDE')).toBe(false);
    expect(isValidGSTIN('27ABCDE1234F1Z5')).toBe(true);
  });

  it('validates Indian phone numbers', () => {
    expect(isValidIndianPhone('+91 9876543210')).toBe(true);
    expect(isValidIndianPhone('9876543210')).toBe(true);
    expect(isValidIndianPhone('1234567890')).toBe(false);
  });

  it('supports compact notation', () => {
    expect(formatINRCompact(1500000)).toBe('₹15 Lakh');
    expect(formatINRCompact(25000000)).toBe('₹2.5 Crore');
  });
});

