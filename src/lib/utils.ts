import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return $${address.slice(0, chars + 2)}...$${address.slice(-chars)};
}

export function formatEther(value: bigint, decimals: number = 4): string {
  const eth = Number(value) / 1e18;
  return eth.toFixed(decimals);
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
