import { AppError } from '../middleware/error';

export function validateString(value: unknown, label: string = 'Field'): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AppError(`${label} must be a non-empty string`, 'VALIDATION_ERROR', 400);
  }
  return value.trim();  
}

export function validateNumber(value: unknown, label: string = 'Field', min?: number, max?: number): number {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new AppError(`${label} must be a valid number`, 'VALIDATION_ERROR', 400);
  }
  if (min !== undefined && num < min) {
    throw new AppError(`${label} must be ≥ ${min}`, 'VALIDATION_ERROR', 400);
  }
  if (max !== undefined && num > max) {
    throw new AppError(`${label} must be ≤ ${max}`, 'VALIDATION_ERROR', 400);
  }
  return num;
}

export function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s'-]/gu, '') // Keep letters, numbers, spaces, hyphens, apostrophes
    .replace(/\s+/g, ' ');
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[&<>"']/g, (m) => {
      const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return map[m];
    })
    .trim()
    .slice(0, 1000); // Cap length for DB safety
}