import { validateString, validateNumber, normalizeWord, sanitizeInput } from '../validation';
import { AppError } from '../../middleware/error';

describe('Validation & Utility Functions', () => {
  describe('validateString', () => {
    it('returns trimmed valid string', () => {
      expect(validateString('  Ephemeral  ', 'Word')).toBe('Ephemeral');
    });

    it('throws for non-string input', () => {
      expect(() => validateString(123, 'Word')).toThrow(AppError);
    });

    it('throws for empty or whitespace-only strings', () => {
      expect(() => validateString('', 'Word')).toThrow(AppError);
      expect(() => validateString('   ', 'Word')).toThrow(AppError);
    });
  });

  describe('validateNumber', () => {
    it('parses valid numbers and numeric strings', () => {
      expect(validateNumber(42, 'Interval')).toBe(42);
      expect(validateNumber('3.14', 'Score')).toBe(3.14);
    });

    it('throws for NaN, Infinity, or non-numeric strings', () => {
      expect(() => validateNumber(NaN, 'Interval')).toThrow(AppError);
      expect(() => validateNumber(Infinity, 'Interval')).toThrow(AppError);
      expect(() => validateNumber('abc', 'Interval')).toThrow(AppError);
    });

    it('enforces min and max bounds', () => {
      expect(() => validateNumber(2, 'Interval', 5)).toThrow(AppError);
      expect(() => validateNumber(20, 'Interval', undefined, 15)).toThrow(AppError);
      expect(validateNumber(10, 'Interval', 5, 15)).toBe(10);
    });
  });

  describe('normalizeWord', () => {
    it('lowercases, trims, and collapses spaces', () => {
      expect(normalizeWord('  Spaced  Repetition  ')).toBe('spaced repetition');
    });

    it('removes punctuation but keeps hyphens & apostrophes', () => {
      expect(normalizeWord("can't")).toBe("can't");
      expect(normalizeWord('self-driving')).toBe('self-driving');
      expect(normalizeWord('hello!')).toBe('hello');
    });

    it('handles unicode letters safely', () => {
      expect(normalizeWord('naïve')).toBe('naïve');
    });
  });

  describe('sanitizeInput', () => {
    it('escapes HTML entities to prevent XSS', () => {
      expect(sanitizeInput('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    });

    it('trims and caps length at 1000 chars', () => {
      const long = 'a'.repeat(1500);
      const result = sanitizeInput(`  ${long}  `);
      expect(result.length).toBe(1000);
      expect(result).toBe('a'.repeat(1000));
    });
  });
});