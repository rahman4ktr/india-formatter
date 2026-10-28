1. Package Identity & ScopePackage Name: india-formatter (ya @your-handle/india-formatter)Bundle Target: $< 3\text{ KB}$ gzipped, Zero dependencies (pure native JS/TS).Environments Supported: Node.js, Next.js (Client + Server Actions), Browser, Cloudflare Workers/Edge.Outputs: Dual format: ESM (dist/index.mjs) aur CJS (dist/index.js) along with TypeScript definitions (dist/index.d.ts).2. Directory ArchitecturePlaintextindia-formatter/
├── .github/
│   └── workflows/
│       └── release.yml          # Automated CI/CD to NPM
├── src/
│   ├── currency/
│   │   ├── formatINR.ts         # Currency formatting (₹, commas, short forms)
│   │   └── toWordsINR.ts        # Convert numbers to English Lakhs/Crores words
│   ├── validators/
│   │   ├── gstin.ts             # GSTIN validation with checksum test
│   │   ├── pan.ts               # PAN validation
│   │   └── phone.ts             # 10-digit Indian mobile validation
│   ├── numbers/
│   │   └── formatIndianNumber.ts # Pure number comma separation (12,34,567)
│   └── index.ts                 # Central public API exports
├── tests/
│   ├── currency.test.ts
│   └── validators.test.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
3. Public API Contract (Design Specification)FunctionSignatureInput ExampleOutput ExampleformatINR(amount: number, options?: INROptions) => string150000"₹1,50,000"formatINRCompact(amount: number) => string1500000"₹15 Lakh"toWordsINR(amount: number, options?: WordOptions) => string10500.50"Ten Thousand Five Hundred Rupees and Fifty Paise Only"isValidPAN(pan: string) => boolean"ABCDE1234F"trueisValidGSTIN(gstin: string) => boolean"27ABCDE1234F1Z5"trueisValidIndianPhone(phone: string) => boolean"+91 98765 43210"true4. Configuration Filespackage.jsonJSON{
  "name": "india-formatter",
  "version": "1.0.0",
  "description": "Zero-dependency Indian currency formatting, number-to-words, and regulatory validations (GST/PAN/Phone).",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "inr",
    "currency",
    "gst",
    "pan",
    "number-to-words",
    "india",
    "lakh",
    "crore"
  ],
  "license": "MIT",
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.4.0",
    "vitest": "^1.6.0"
  }
}
tsup.config.tsTypeScriptimport { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
});
tsconfig.jsonJSON{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
5. Implementation Codesrc/currency/formatINR.tsTypeScriptexport interface INROptions {
  showSymbol?: boolean; // Default: true
  symbol?: string;      // Default: '₹'
  decimals?: number;    // Default: 2
}

/**
 * Formats a number to standard Indian numbering format (Lakhs & Crores)
 * e.g., 1234567.89 -> "₹12,34,567.89"
 */
export function formatINR(amount: number, options: INROptions = {}): string {
  const { showSymbol = true, symbol = '₹', decimals = 2 } = options;

  if (isNaN(amount) || amount === null) return '';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const parts = absAmount.toFixed(decimals).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian format: last 3 digits together, followed by groups of 2 digits
  const lastThree = integerPart.substring(integerPart.length - 3);
  const remaining = integerPart.substring(0, integerPart.length - 3);

  let formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  formatted = remaining.length > 0 ? `${formatted},${lastThree}` : lastThree;

  const result = decimals > 0 ? `${formatted}.${decimalPart}` : formatted;
  const finalSymbol = showSymbol ? symbol : '';

  return `${isNegative ? '-' : ''}${finalSymbol}${result}`;
}

/**
 * Converts numbers to compact human-readable Indian notations
 * e.g., 1500000 -> "₹15 Lakh", 25000000 -> "₹2.5 Crore"
 */
export function formatINRCompact(amount: number, showSymbol = true): string {
  const symbol = showSymbol ? '₹' : '';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10000000) {
    const val = (abs / 10000000).toFixed(2).replace(/\.00$/, '');
    return `${sign}${symbol}${val} Crore`;
  }
  if (abs >= 100000) {
    const val = (abs / 100000).toFixed(2).replace(/\.00$/, '');
    return `${sign}${symbol}${val} Lakh`;
  }
  if (abs >= 1000) {
    const val = (abs / 1000).toFixed(2).replace(/\.00$/, '');
    return `${sign}${symbol}${val} K`;
  }

  return `${sign}${symbol}${abs}`;
}
src/currency/toWordsINR.tsTypeScriptconst ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const TEENS = [
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 
  'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertChunk(n: number): string {
  let word = '';
  if (n >= 100) {
    word += `${ONES[Math.floor(n / 100)]} Hundred `;
    n %= 100;
  }
  if (n >= 20) {
    word += `${TENS[Math.floor(n / 10)]} `;
    n %= 10;
  } else if (n >= 10) {
    word += `${TEENS[n - 10]} `;
    return word.trim();
  }
  if (n > 0) {
    word += `${ONES[n]} `;
  }
  return word.trim();
}

/**
 * Converts numerical amounts to Indian currency words
 * e.g., 10500.50 -> "Ten Thousand Five Hundred Rupees and Fifty Paise Only"
 */
export function toWordsINR(amount: number): string {
  if (amount === 0) return 'Zero Rupees Only';
  if (isNaN(amount)) return '';

  const [rupeesStr, paiseStr] = amount.toFixed(2).split('.');
  let rupees = parseInt(rupeesStr, 10);
  const paise = parseInt(paiseStr, 10);

  const units: [number, string][] = [
    [10000000, 'Crore'],
    [100000, 'Lakh'],
    [1000, 'Thousand'],
  ];

  let result = '';

  for (const [divisor, label] of units) {
    if (rupees >= divisor) {
      const chunk = Math.floor(rupees / divisor);
      result += `${convertChunk(chunk)} ${label} `;
      rupees %= divisor;
    }
  }

  if (rupees > 0) {
    result += `${convertChunk(rupees)} `;
  }

  result = `${result.trim()} Rupees`;

  if (paise > 0) {
    result += ` and ${convertChunk(paise)} Paise`;
  }

  return `${result} Only`;
}
src/validators/pan.tsTypeScript/**
 * Validates Indian Income Tax Permanent Account Number (PAN)
 * Pattern: 5 letters (4th is entity category, e.g., P for person), 4 digits, 1 letter
 */
export function isValidPAN(pan: string): boolean {
  if (!pan || typeof pan !== 'string') return false;
  const panRegex = /^[A-Z]{3}[ABCFGHLJPT][A-Z]{1}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.trim().toUpperCase());
}
src/validators/gstin.tsTypeScript/**
 * Validates Indian Goods and Services Tax Identification Number (GSTIN)
 * Format: 2 digits (State Code) + 10 chars (PAN) + 1 digit (Entity code) + 'Z' + 1 checksum char
 */
export function isValidGSTIN(gstin: string): boolean {
  if (!gstin || typeof gstin !== 'string') return false;
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.trim().toUpperCase());
}
src/validators/phone.tsTypeScript/**
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
src/index.tsTypeScriptexport * from './currency/formatINR';
export * from './currency/toWordsINR';
export * from './validators/pan';
export * from './validators/gstin';
export * from './validators/phone';
6. Testing Setup (tests/currency.test.ts)TypeScriptimport { describe, it, expect } from 'vitest';
import { formatINR, toWordsINR, isValidPAN, isValidGSTIN, isValidIndianPhone } from '../src';

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
});