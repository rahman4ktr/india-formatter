export interface FormatIndianNumberOptions {
  decimals?: number;
}

/**
 * Formats a number to standard Indian numbering format (Lakhs & Crores comma separation)
 * e.g., 1234567 -> "12,34,567"
 *       1234567.89 -> "12,34,567.89"
 */
export function formatIndianNumber(
  amount: number | string,
  options?: number | FormatIndianNumberOptions
): string {
  if (amount === null || amount === undefined || amount === '') return '';
  const num = typeof amount === 'string' ? Number(amount) : amount;
  if (isNaN(num)) return '';

  const isNegative = num < 0;
  const absAmount = Math.abs(num);

  const decimals =
    typeof options === 'number'
      ? options
      : options?.decimals !== undefined
      ? options.decimals
      : undefined;

  let integerPart: string;
  let decimalPart: string | undefined;

  if (decimals !== undefined) {
    const parts = absAmount.toFixed(decimals).split('.');
    integerPart = parts[0];
    decimalPart = parts[1];
  } else {
    const str = absAmount.toString();
    const parts = str.split('.');
    integerPart = parts[0];
    decimalPart = parts[1];
  }

  const lastThree = integerPart.substring(Math.max(0, integerPart.length - 3));
  const remaining = integerPart.substring(0, Math.max(0, integerPart.length - 3));

  let formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  formatted = remaining.length > 0 ? `${formatted},${lastThree}` : lastThree;

  const result =
    decimalPart !== undefined && decimalPart.length > 0
      ? `${formatted}.${decimalPart}`
      : formatted;

  return `${isNegative ? '-' : ''}${result}`;
}

