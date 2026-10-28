# india-formatter

Zero-dependency, ultra-lightweight ($< 3\text{ KB}$ gzipped) library for Indian currency formatting, number-to-words, and regulatory validations (GSTIN, PAN, Phone).

Supports **Node.js**, **Next.js** (Client & Server Components / Server Actions), **Browsers**, and **Edge / Cloudflare Workers**. Dual ESM/CJS build with full TypeScript definitions.

---

## Features

- ⚡ **Zero Dependencies**: Pure native TypeScript/JavaScript.
- 📦 **Ultra Lightweight**: $< 3\text{ KB}$ gzipped bundle.
- 💰 **INR Currency Formatting**: Proper Lakhs/Crores grouping (`₹12,34,567.89`) and compact notation (`₹15 Lakh`, `₹2.5 Crore`).
- 🗣️ **Number to Words**: Convert amounts to Indian English words (`Ten Thousand Five Hundred Rupees and Fifty Paise Only`).
- 🔢 **Pure Indian Number Separation**: Group pure numbers (`12,34,567`).
- 🛡️ **Regulatory Validators**: Validations for GSTIN, PAN, and 10-digit Indian mobile numbers.
- 🌐 **Universal Runtime Support**: ESM & CommonJS with first-class TypeScript types.

---

## Installation

```bash
npm install india-formatter
```

```bash
yarn add india-formatter
```

```bash
pnpm add india-formatter
```

---

## Usage

### 1. Currency Formatting (`formatINR`, `formatINRCompact`)

```typescript
import { formatINR, formatINRCompact } from 'india-formatter';

// Standard INR formatting
formatINR(1234567.89);
// => "₹12,34,567.89"

formatINR(500, { showSymbol: false });
// => "500.00"

formatINR(150000, { decimals: 0 });
// => "₹1,50,000"

formatINR(150000, { symbol: 'Rs. ' });
// => "Rs. 1,50,000.00"

// Compact notation (K, Lakh, Crore)
formatINRCompact(1500);
// => "₹1.5 K"

formatINRCompact(1500000);
// => "₹15 Lakh"

formatINRCompact(25000000);
// => "₹2.5 Crore"

formatINRCompact(1500000, false);
// => "15 Lakh"
```

### 2. Pure Number Formatting (`formatIndianNumber`)

```typescript
import { formatIndianNumber } from 'india-formatter';

formatIndianNumber(1234567);
// => "12,34,567"

formatIndianNumber(1234567.89);
// => "12,34,567.89"

formatIndianNumber(1234567, 2);
// => "12,34,567.00"
```

### 3. Number to Indian English Words (`toWordsINR`)

```typescript
import { toWordsINR } from 'india-formatter';

toWordsINR(125000);
// => "One Lakh Twenty Five Thousand Rupees Only"

toWordsINR(10500.50);
// => "Ten Thousand Five Hundred Rupees and Fifty Paise Only"

toWordsINR(0);
// => "Zero Rupees Only"

toWordsINR(500, { showOnly: false });
// => "Five Hundred Rupees"
```

### 4. Regulatory Validations

#### PAN Validation (`isValidPAN`)

Validates 10-character Indian Permanent Account Number (PAN).

```typescript
import { isValidPAN } from 'india-formatter';

isValidPAN('ABCDE1234F'); // => true
isValidPAN('12345ABCDE'); // => false

// Strict mode: checks 4th character for legal entity category (P, C, H, F, A, T, B, L, J, G)
isValidPAN('ABCPE1234F', { strict: true }); // => true (Person)
isValidPAN('ABCDE1234F', { strict: true }); // => false ('D' is not an entity category)
```

#### GSTIN Validation (`isValidGSTIN`)

Validates 15-character Goods and Services Tax Identification Number.

```typescript
import { isValidGSTIN } from 'india-formatter';

isValidGSTIN('27ABCDE1234F1Z5'); // => true
isValidGSTIN('invalid-gst');    // => false
```

#### Indian Phone Number Validation (`isValidIndianPhone`)

Validates 10-digit Indian mobile numbers (starting with 6-9), supporting `+91`, `91`, or `0` prefixes and spaces/hyphens.

```typescript
import { isValidIndianPhone } from 'india-formatter';

isValidIndianPhone('+91 98765 43210'); // => true
isValidIndianPhone('9876543210');       // => true
isValidIndianPhone('+919876543210');    // => true
isValidIndianPhone('09876543210');      // => true
isValidIndianPhone('1234567890');       // => false
```

---

## API Reference

### `formatINR(amount, options?)`
- `amount`: `number` - Numerical value to format.
- `options`:
  - `showSymbol`: `boolean` (default: `true`)
  - `symbol`: `string` (default: `'₹'`)
  - `decimals`: `number` (default: `2`)

### `formatINRCompact(amount, showSymbol?)`
- `amount`: `number` - Numerical value to format compactly.
- `showSymbol`: `boolean` (default: `true`)

### `formatIndianNumber(amount, options?)`
- `amount`: `number | string` - Number or numerical string.
- `options`: `number | { decimals?: number }`

### `toWordsINR(amount, options?)`
- `amount`: `number` - Number to convert to words.
- `options`: `{ showOnly?: boolean }` (default: `{ showOnly: true }`)

### `isValidPAN(pan, options?)`
- `pan`: `string` - PAN card string.
- `options`: `{ strict?: boolean }`

### `isValidGSTIN(gstin)`
- `gstin`: `string` - GST identification number.

### `isValidIndianPhone(phone)`
- `phone`: `string` - Mobile number string.

---

## Development & Testing

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package (CJS, ESM, DTS)
npm run build
```

---

## License

[MIT](LICENSE)

