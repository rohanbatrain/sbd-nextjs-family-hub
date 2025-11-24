import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format SBD token amount for display with 2 decimal places.
 * 
 * @param amount - The token amount (can be number or string)
 * @param includeSymbol - Whether to include "SBD" suffix (default: true)
 * @returns Formatted string (e.g., "1,234.50 SBD")
 * 
 * @example
 * formatSBDTokens(1234.5) // "1,234.50 SBD"
 * formatSBDTokens(100, false) // "100.00"
 * formatSBDTokens(0.5) // "0.50 SBD"
 */
export function formatSBDTokens(amount: number | string, includeSymbol: boolean = true): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return includeSymbol ? "0.00 SBD" : "0.00";
  }

  // Format with thousands separator and 2 decimal places
  const formatted = numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return includeSymbol ? `${formatted} SBD` : formatted;
}

/**
 * Parse SBD token input and validate decimal precision.
 * 
 * @param input - The input string or number
 * @returns Validated number rounded to 2 decimal places, or null if invalid
 * 
 * @example
 * parseSBDTokenInput("100.50") // 100.50
 * parseSBDTokenInput("99.999") // 100.00 (rounded)
 * parseSBDTokenInput("invalid") // null
 */
export function parseSBDTokenInput(input: string | number): number | null {
  const numValue = typeof input === 'string' ? parseFloat(input) : input;

  if (isNaN(numValue) || numValue < 0) {
    return null;
  }

  // Round to 2 decimal places
  return Math.round(numValue * 100) / 100;
}
