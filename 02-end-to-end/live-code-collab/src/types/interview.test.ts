import { describe, it, expect } from 'vitest';
import { LANGUAGE_CONFIG, type SupportedLanguage } from '@/types/interview';

describe('Interview Types', () => {
  describe('LANGUAGE_CONFIG', () => {
    it('should have configuration for all supported languages', () => {
      const expectedLanguages: SupportedLanguage[] = ['javascript', 'typescript', 'python', 'java', 'cpp'];
      
      expectedLanguages.forEach(lang => {
        expect(LANGUAGE_CONFIG[lang]).toBeDefined();
        expect(LANGUAGE_CONFIG[lang].label).toBeDefined();
        expect(LANGUAGE_CONFIG[lang].extension).toBeDefined();
        expect(LANGUAGE_CONFIG[lang].defaultCode).toBeDefined();
      });
    });

    it('should have correct file extensions', () => {
      expect(LANGUAGE_CONFIG.javascript.extension).toBe('js');
      expect(LANGUAGE_CONFIG.typescript.extension).toBe('ts');
      expect(LANGUAGE_CONFIG.python.extension).toBe('py');
      expect(LANGUAGE_CONFIG.java.extension).toBe('java');
      expect(LANGUAGE_CONFIG.cpp.extension).toBe('cpp');
    });

    it('should have default code that includes solution function', () => {
      Object.values(LANGUAGE_CONFIG).forEach(config => {
        expect(config.defaultCode.toLowerCase()).toContain('solution');
      });
    });
  });
});
