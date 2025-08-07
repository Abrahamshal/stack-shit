import { describe, it, expect } from 'vitest';
import { validateFile, validateJSONContent, sanitizeFileName } from './fileValidation';

describe('File Validation', () => {
  describe('validateFile', () => {
    it('should accept valid JSON files', () => {
      const file = new File(['{}'], 'test.json', { type: 'application/json' });
      const result = validateFile(file);
      expect(result.isValid).toBe(true);
    });

    it('should reject non-JSON files', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid JSON file');
    });

    it('should reject files that are too large', () => {
      const largeContent = new Array(11 * 1024 * 1024).join('a');
      const file = new File([largeContent], 'large.json', { type: 'application/json' });
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('10MB');
    });

    it('should reject files with dangerous names', () => {
      const file = new File(['{}'], '../../../etc/passwd.json', { type: 'application/json' });
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid file name');
    });
  });

  describe('validateJSONContent', () => {
    it('should accept valid JSON', async () => {
      const result = await validateJSONContent('{"nodes": [{"id": "1"}]}');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid JSON', async () => {
      const result = await validateJSONContent('{invalid json}');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid JSON format');
    });

    it('should reject JSON that is too large', async () => {
      // Generate JSON larger than 10MB
      const data = 'a'.repeat(11 * 1024 * 1024);
      const largeJSON = JSON.stringify({ data });
      const result = await validateJSONContent(largeJSON);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too large');
    });

    it('should reject workflows with too many nodes', async () => {
      const nodes = Array.from({ length: 10001 }, (_, i) => ({ id: i }));
      const result = await validateJSONContent(JSON.stringify({ nodes }));
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('maximum node limit');
    });
  });

  describe('sanitizeFileName', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeFileName('../../../etc/passwd')).toBe('______etc_passwd');
      expect(sanitizeFileName('file<script>.json')).toBe('file_script_.json');
    });

    it('should limit filename length', () => {
      const longName = 'a'.repeat(300);
      const sanitized = sanitizeFileName(longName);
      expect(sanitized.length).toBe(255);
    });
  });
});