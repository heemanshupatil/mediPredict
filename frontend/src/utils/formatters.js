/**
 * Utility functions for Indian Rupee (₹) formatting and healthcare metrics.
 */

export function formatINR(val, options = {}) {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const num = Number(val);
  const decimals = options.decimals !== undefined ? options.decimals : 0;
  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatINRCompact(val) {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const num = Math.round(Number(val));
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakh`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}k`;
  }
  return `₹${num}`;
}
