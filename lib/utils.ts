import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(valueInCents: number, currency = 'MDL') {
  return new Intl.NumberFormat('ro-MD', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol'
  }).format(valueInCents / 100);
}
