/**
 * Tests for CSS Analyzer
 * Note: Full integration tests require VS Code environment.
 * These tests focus on configuration management.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CssAnalyzer } from '../../src/diagnostics/CssAnalyzer';
import type { LogicalCssConfig } from '../../src/types';

describe('CssAnalyzer', () => {
  const mockConfig: LogicalCssConfig = {
    enable: true,
    enableQuickFix: true,
    severity: 'warning',
    ignoreProperties: [],
    ignoreValues: [],
    enableHover: true,
    enableStatusBar: true,
    autoFixOnSave: false,
    checkShorthands: true,
    checkBlockProperties: false,
    checkSizeProperties: false,
  };

  let analyzer: CssAnalyzer;

  beforeEach(() => {
    analyzer = new CssAnalyzer({ ...mockConfig });
  });

  describe('updateConfig', () => {
    it('should update configuration', () => {
      const newConfig: LogicalCssConfig = {
        ...mockConfig,
        severity: 'error',
      };
      analyzer.updateConfig(newConfig);
      // Config should be updated internally
      expect(analyzer['config'].severity).toBe('error');
    });

    it('should update ignore properties', () => {
      const newConfig: LogicalCssConfig = {
        ...mockConfig,
        ignoreProperties: ['margin-left'],
      };
      analyzer.updateConfig(newConfig);
      expect(analyzer['config'].ignoreProperties).toEqual(['margin-left']);
    });

    it('should update ignore values', () => {
      const newConfig: LogicalCssConfig = {
        ...mockConfig,
        ignoreValues: ['left', 'right'],
      };
      analyzer.updateConfig(newConfig);
      expect(analyzer['config'].ignoreValues).toEqual(['left', 'right']);
    });
  });

  describe('analyze', () => {
    function createMockDocument(css: string) {
      return {
        getText: () => css,
        positionAt: (offset: number) => {
          const textBefore = css.slice(0, offset);
          const lines = textBefore.split('\n');
          const line = lines.length - 1;
          const character = lines[lines.length - 1].length;
          return { line, character };
        },
      } as any;
    }

    it('should detect physical properties with exact property name ranges', () => {
      const css = '.box {\n  margin-left: 10px;\n}';
      const doc = createMockDocument(css);
      const issues = analyzer.analyze(doc);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('physical-property');
      expect(issues[0].physical).toBe('margin-left');
      expect(issues[0].logical).toBe('margin-inline-start');
      // margin-left starts at line 1, char 2 and ends at line 1, char 13
      expect(issues[0].range.start.character).toBe(2);
      expect(issues[0].range.end.character).toBe(13);
    });

    it('should detect direction-sensitive values with exact value token ranges', () => {
      const css = '.text {\n  text-align: left;\n}';
      const doc = createMockDocument(css);
      const issues = analyzer.analyze(doc);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('direction-value');
      expect(issues[0].physical).toBe('left');
      expect(issues[0].logical).toBe('start');
      // 'left' is at line 1, char 14 to 18
      expect(issues[0].range.start.character).toBe(14);
      expect(issues[0].range.end.character).toBe(18);
    });

    it('should not flag background-position (not supported by CSS logical properties)', () => {
      const css = '.bg {\n  background-position: right 8px center;\n}';
      const doc = createMockDocument(css);
      const issues = analyzer.analyze(doc);

      expect(issues).toHaveLength(0);
    });

    it('should respect block ignore comments', () => {
      const css = [
        '/* rtl-ignore-start */',
        '.box { margin-left: 10px; }',
        '/* rtl-ignore-end */',
        '.active { margin-left: 20px; }',
      ].join('\n');
      const doc = createMockDocument(css);
      const issues = analyzer.analyze(doc);

      expect(issues).toHaveLength(1);
      expect(issues[0].range.start.line).toBe(3);
    });

    it('should detect 4-value shorthands with differing horizontal values', () => {
      const css = '.box { padding: 10px 20px 10px 40px; }';
      const doc = createMockDocument(css);
      const issues = analyzer.analyze(doc);

      expect(issues).toHaveLength(1);
      expect(issues[0].physical).toBe('10px 20px 10px 40px');
      expect(issues[0].reason).toContain('differing horizontal values');
    });

    it('should ignore shorthands when checkShorthands is false', () => {
      analyzer.updateConfig({ ...mockConfig, checkShorthands: false });
      const css = '.box { padding: 10px 20px 10px 40px; }';
      const doc = createMockDocument(css);
      const issues = analyzer.analyze(doc);

      expect(issues).toHaveLength(0);
    });

    it('should ignore block properties when checkBlockProperties is false by default', () => {
      const css = '.box { margin-top: 10px; top: 0; }';
      const doc = createMockDocument(css);
      const issues = analyzer.analyze(doc);

      expect(issues).toHaveLength(0);
    });

    it('should detect block properties when checkBlockProperties is true', () => {
      analyzer.updateConfig({ ...mockConfig, checkBlockProperties: true });
      const css = '.box { margin-top: 10px; }';
      const doc = createMockDocument(css);
      const issues = analyzer.analyze(doc);

      expect(issues).toHaveLength(1);
      expect(issues[0].physical).toBe('margin-top');
      expect(issues[0].logical).toBe('margin-block-start');
    });

    it('should detect size properties when checkSizeProperties is true', () => {
      analyzer.updateConfig({ ...mockConfig, checkSizeProperties: true });
      const css = '.box { width: 100px; }';
      const doc = createMockDocument(css);
      const issues = analyzer.analyze(doc);

      expect(issues).toHaveLength(1);
      expect(issues[0].physical).toBe('width');
      expect(issues[0].logical).toBe('inline-size');
    });

    it('should detect scroll-margin-left as an inline rule', () => {
      const css = '.box { scroll-margin-left: 10px; }';
      const doc = createMockDocument(css);
      const issues = analyzer.analyze(doc);

      expect(issues).toHaveLength(1);
      expect(issues[0].physical).toBe('scroll-margin-left');
      expect(issues[0].logical).toBe('scroll-margin-inline-start');
    });
  });
});
