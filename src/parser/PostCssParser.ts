/**
 * PostCSS-based CSS parser
 * Handles parsing of CSS, SCSS, and style blocks
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const safeParser = require('postcss-safe-parser');
import type { Declaration, Root } from 'postcss';
import type { TextDocument } from 'vscode';
import { DeclarationInfo } from '../types';

export class PostCssParser {
  /**
   * Parse a CSS document and extract declarations
   */
  public parseDocument(document: TextDocument): DeclarationInfo[] {
    const content = document.getText();
    return this.parseContent(content);
  }

  /**
   * Parse CSS content and extract declarations
   */
  public parseContent(content: string): DeclarationInfo[] {
    const declarations: DeclarationInfo[] = [];

    try {
      const root = safeParser(content, { from: undefined }) as Root;

      root.walkDecls((decl: Declaration) => {
        const start = decl.source?.start ?? { line: 1, column: 1, offset: 0 };
        const startOffset = decl.source?.start?.offset ?? 0;
        const endOffset = decl.source?.end?.offset ?? 0;
        const propLength = decl.prop.length;
        const propStart = startOffset;
        const propEnd = startOffset + propLength;
        const between = decl.raws?.between ?? ': ';
        const valueStart = propEnd + between.length;
        const valueEnd = valueStart + decl.value.length;

        declarations.push({
          property: decl.prop,
          value: decl.value,
          start: startOffset,
          end: endOffset,
          propStart,
          propEnd,
          valueStart,
          valueEnd,
          line: start.line - 1, // Convert to 0-based
          column: start.column - 1, // Convert to 0-based
        });
      });
    } catch (error) {
      // If parsing fails, return empty array
      // The safe parser should handle most cases, but we want to be defensive
      console.error('CSS parsing error:', error);
    }

    return declarations;
  }

  /**
   * Get all line numbers (0-indexed) that are ignored by comments
   */
  public getIgnoredLines(content: string): Set<number> {
    const ignoredLines = new Set<number>();
    const lines = content.split(/\r?\n/);
    let inBlockIgnore = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const trimmed = line.trim();

      // Check block ignore start
      if (
        trimmed.includes('/* rtl-ignore-start */') ||
        trimmed.includes('// rtl-ignore-start') ||
        trimmed.includes('/* rtl-disable */') ||
        trimmed.includes('// rtl-disable') ||
        trimmed.includes('/* logical-css-disable */') ||
        trimmed.includes('// logical-css-disable') ||
        trimmed === '/* rtl-ignore */'
      ) {
        inBlockIgnore = true;
        ignoredLines.add(i);
        continue;
      }

      // Check block ignore end
      if (
        inBlockIgnore &&
        (trimmed.includes('/* rtl-ignore-end */') ||
          trimmed.includes('// rtl-ignore-end') ||
          trimmed.includes('/* rtl-enable */') ||
          trimmed.includes('// rtl-enable') ||
          trimmed.includes('/* logical-css-enable */') ||
          trimmed.includes('// logical-css-enable') ||
          trimmed === '/* end */')
      ) {
        inBlockIgnore = false;
        ignoredLines.add(i);
        continue;
      }

      if (inBlockIgnore) {
        ignoredLines.add(i);
        continue;
      }

      // Check for inline rtl-ignore on the same line
      if (
        line.includes('/* rtl-ignore */') ||
        line.includes('// rtl-ignore') ||
        line.includes('/* rtl-disable-line */') ||
        line.includes('// rtl-disable-line') ||
        line.includes('/* logical-css-disable-line */') ||
        line.includes('// logical-css-disable-line')
      ) {
        ignoredLines.add(i);
      }

      // Check for rtl-ignore-next-line on previous line
      if (
        line.includes('/* rtl-ignore-next-line */') ||
        line.includes('// rtl-ignore-next-line') ||
        line.includes('/* rtl-disable-next-line */') ||
        line.includes('// rtl-disable-next-line') ||
        line.includes('/* logical-css-disable-next-line */') ||
        line.includes('// logical-css-disable-next-line')
      ) {
        if (i + 1 < lines.length) {
          ignoredLines.add(i + 1);
        }
      }
    }

    return ignoredLines;
  }

  /**
   * Check if a line has an ignore comment
   */
  public hasIgnoreComment(content: string, lineNumber: number): boolean {
    return this.getIgnoredLines(content).has(lineNumber);
  }

  /**
   * Check if a declaration is within an ignore block
   */
  public isInIgnoreBlock(content: string, startLine: number, endLine: number): boolean {
    const lines = content.split(/\r?\n/);
    let inIgnoreBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const trimmed = line.trim();

      if (
        trimmed.includes('/* rtl-ignore-start */') ||
        trimmed.includes('/* rtl-disable */') ||
        trimmed.includes('/* logical-css-disable */') ||
        trimmed.includes('/* rtl-ignore */') ||
        trimmed.includes('// rtl-ignore')
      ) {
        inIgnoreBlock = true;
        continue;
      }

      if (
        inIgnoreBlock &&
        (trimmed.includes('/* rtl-ignore-end */') ||
          trimmed.includes('/* rtl-enable */') ||
          trimmed.includes('/* logical-css-enable */') ||
          trimmed.includes('/* end */') ||
          line.includes('*/') ||
          trimmed.endsWith('*/'))
      ) {
        inIgnoreBlock = false;
        continue;
      }

      if (i >= startLine && i <= endLine && inIgnoreBlock) {
        return true;
      }
    }

    return false;
  }
}
