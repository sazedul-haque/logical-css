/**
 * Tests for PostCSS Parser
 */

import { describe, it, expect } from 'vitest';
import { PostCssParser } from '../../src/parser/PostCssParser';

describe('PostCssParser', () => {
  const parser = new PostCssParser();

  describe('parseContent', () => {
    it('should parse simple CSS', () => {
      const css = `
        .foo {
          margin-left: 10px;
          padding-right: 20px;
        }
      `;
      const declarations = parser.parseContent(css);
      expect(declarations).toHaveLength(2);
      expect(declarations[0].property).toBe('margin-left');
      expect(declarations[0].value).toBe('10px');
      expect(declarations[1].property).toBe('padding-right');
      expect(declarations[1].value).toBe('20px');
    });

    it('should parse CSS with multiple selectors', () => {
      const css = `
        .foo {
          margin-left: 10px;
        }
        .bar {
          padding-right: 20px;
        }
      `;
      const declarations = parser.parseContent(css);
      expect(declarations).toHaveLength(2);
    });

    it('should parse CSS with comments', () => {
      const css = `
        /* This is a comment */
        .foo {
          margin-left: 10px; /* inline comment */
        }
      `;
      const declarations = parser.parseContent(css);
      expect(declarations).toHaveLength(1);
      expect(declarations[0].property).toBe('margin-left');
    });

    it('should handle empty CSS', () => {
      const css = '';
      const declarations = parser.parseContent(css);
      expect(declarations).toHaveLength(0);
    });

    it('should handle invalid CSS gracefully', () => {
      const css = 'invalid css {{';
      const declarations = parser.parseContent(css);
      // Should not throw, but may return empty or partial results
      expect(Array.isArray(declarations)).toBe(true);
    });

    it('should parse SCSS-like syntax', () => {
      const css = `
        $var: 10px;
        .foo {
          margin-left: $var;
        }
      `;
      const declarations = parser.parseContent(css);
      expect(declarations.length).toBeGreaterThan(0);
    });

    it('should calculate accurate prop and value offsets', () => {
      const css = '  margin-left: 10px;';
      const declarations = parser.parseContent(css);
      expect(declarations).toHaveLength(1);
      const decl = declarations[0];
      expect(css.substring(decl.propStart, decl.propEnd)).toBe('margin-left');
      expect(css.substring(decl.valueStart, decl.valueEnd)).toBe('10px');
    });
  });

  describe('getIgnoredLines and block ignores', () => {
    it('should ignore lines inside /* rtl-ignore-start */ and /* rtl-ignore-end */', () => {
      const content = [
        '/* rtl-ignore-start */', // line 0
        '.foo {',                // line 1
        '  margin-left: 10px;',  // line 2
        '}',                     // line 3
        '/* rtl-ignore-end */',   // line 4
        '.bar {',                // line 5
        '  margin-left: 10px;',  // line 6
        '}',
      ].join('\n');

      const ignored = parser.getIgnoredLines(content);
      expect(ignored.has(2)).toBe(true);
      expect(ignored.has(6)).toBe(false);
    });

    it('should ignore lines inside /* logical-css-disable */ and /* logical-css-enable */', () => {
      const content = [
        '/* logical-css-disable */',
        '.foo { margin-left: 10px; }',
        '/* logical-css-enable */',
        '.bar { margin-left: 10px; }',
      ].join('\n');

      const ignored = parser.getIgnoredLines(content);
      expect(ignored.has(1)).toBe(true);
      expect(ignored.has(3)).toBe(false);
    });
  });

  describe('hasIgnoreComment', () => {
    it('should detect rtl-ignore on the same line', () => {
      const content = `
        .foo {
          margin-left: 10px; /* rtl-ignore */
        }
      `;
      expect(parser.hasIgnoreComment(content, 2)).toBe(true);
    });

    it('should detect rtl-ignore-next-line on previous line', () => {
      const content = `
        /* rtl-ignore-next-line */
        .foo {
          margin-left: 10px;
        }
      `;
      expect(parser.hasIgnoreComment(content, 2)).toBe(true);
    });

    it('should not detect ignore when not present', () => {
      const content = `
        .foo {
          margin-left: 10px;
        }
      `;
      expect(parser.hasIgnoreComment(content, 2)).toBe(false);
    });

    it('should handle // rtl-ignore syntax', () => {
      const content = `
        .foo {
          margin-left: 10px; // rtl-ignore
        }
      `;
      expect(parser.hasIgnoreComment(content, 2)).toBe(true);
    });
  });

  describe('isInIgnoreBlock', () => {
    it('should detect ignore block', () => {
      const content = `
        /* rtl-ignore */
        .foo {
          margin-left: 10px;
        }
        /* end */
      `;
      expect(parser.isInIgnoreBlock(content, 2, 3)).toBe(true);
    });

    it('should not detect ignore when not in block', () => {
      const content = `
        .foo {
          margin-left: 10px;
        }
      `;
      expect(parser.isInIgnoreBlock(content, 1, 2)).toBe(false);
    });
  });
});
