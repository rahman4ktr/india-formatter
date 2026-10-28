export interface WordOptions {
  showOnly?: boolean;
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
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
export function toWordsINR(amount: number, options: WordOptions = {}): string {
  const { showOnly = true } = options;

  if (amount === 0) return showOnly ? 'Zero Rupees Only' : 'Zero Rupees';
  if (isNaN(amount) || amount === null) return '';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const [rupeesStr, paiseStr] = absAmount.toFixed(2).split('.');
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

  result = result.trim() ? `${result.trim()} Rupees` : '';

  if (paise > 0) {
    if (result) {
      result += ` and ${convertChunk(paise)} Paise`;
    } else {
      result = `${convertChunk(paise)} Paise`;
    }
  }

  const prefix = isNegative ? 'Minus ' : '';
  const suffix = showOnly ? ' Only' : '';

  return `${prefix}${result}${suffix}`.trim();
}

