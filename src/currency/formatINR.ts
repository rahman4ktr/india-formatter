export interface INROptions {
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
  const lastThree = integerPart.substring(Math.max(0, integerPart.length - 3));
  const remaining = integerPart.substring(0, Math.max(0, integerPart.length - 3));

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
    const val = (abs / 10000000).toFixed(2).replace(/\.?0+$/, '');
    return `${sign}${symbol}${val} Crore`;
  }
  if (abs >= 100000) {
    const val = (abs / 100000).toFixed(2).replace(/\.?0+$/, '');
    return `${sign}${symbol}${val} Lakh`;
  }
  if (abs >= 1000) {
    const val = (abs / 1000).toFixed(2).replace(/\.?0+$/, '');
    return `${sign}${symbol}${val} K`;
  }

  return `${sign}${symbol}${abs}`;
}

