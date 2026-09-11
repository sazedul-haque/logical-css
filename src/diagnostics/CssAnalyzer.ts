/**
 * CSS Analyzer - Detects physical properties and direction-sensitive values
 */

import type { TextDocument, Range } from 'vscode';
import { PostCssParser } from '../parser/PostCssParser';
import {
  isPhysicalProperty,
  isDirectionSensitiveValue,
  getLogicalProperty,
  getLogicalValue,
  isShorthandProperty,
} from './Rules';
import type { CssIssue, LogicalCssConfig, DeclarationInfo } from '../types';

export class CssAnalyzer {
  private parser: PostCssParser;
  private config: LogicalCssConfig;

  constructor(config: LogicalCssConfig) {
    this.parser = new PostCssParser();
    this.config = config;
  }

  /**
   * Analyze a document and return CSS issues
   */
  public analyze(document: TextDocument): CssIssue[] {
    if (!this.config.enable) {
      return [];
    }

    const content = document.getText();
    const declarations = this.parser.parseDocument(document);
    const ignoredLines = this.parser.getIgnoredLines(content);
    const issues: CssIssue[] = [];

    for (const decl of declarations) {
      // Check if this declaration is ignored
      if (ignoredLines.has(decl.line)) {
        continue;
      }

      // Check if property is in ignore list
      if (this.config.ignoreProperties.includes(decl.property)) {
        continue;
      }

      // Check for physical properties
      if (isPhysicalProperty(decl.property)) {
        const rule = getLogicalProperty(decl.property);
        if (rule) {
          const range = this.createPropertyRange(document, decl);
          issues.push({
            type: 'physical-property',
            physical: rule.physical,
            logical: rule.logical,
            reason: rule.reason,
            range,
            isIgnored: false,
          });
        }
      }

      // Check for direction-sensitive values
      if (isDirectionSensitiveValue(decl.property, decl.value)) {
        // Check if value is in ignore list
        if (this.config.ignoreValues.includes(decl.value)) {
          continue;
        }

        const valueRule = getLogicalValue(decl.property, decl.value);
        if (valueRule) {
          const range = this.createValueRange(document, decl, valueRule.physical);
          issues.push({
            type: 'direction-value',
            physical: valueRule.physical,
            logical: valueRule.logical,
            reason: valueRule.reason,
            range,
            isIgnored: false,
          });
        }
      }

      // Handle 4-value shorthand properties with asymmetrical horizontal values
      if (
        this.config.checkShorthands &&
        isShorthandProperty(decl.property) &&
        ['margin', 'padding', 'border-color', 'border-style', 'border-width'].includes(
          decl.property
        )
      ) {
        if (!this.config.ignoreProperties.includes(decl.property)) {
          const parts = decl.value.trim().split(/\s+/);
          // 4-value syntax: top, right, bottom, left
          if (parts.length === 4 && parts[1] !== parts[3]) {
            const range = this.createRange(document, decl);
            issues.push({
              type: 'direction-value',
              physical: decl.value,
              logical: decl.value,
              reason: `Shorthand property '${decl.property}' has differing horizontal values (${parts[1]} vs ${parts[3]}). Consider using logical properties like ${decl.property}-inline-start and ${decl.property}-inline-end for RTL support.`,
              range,
              isIgnored: false,
            });
          }
        }
      }
    }

    return issues;
  }

  /**
   * Create a VS Code Range covering only the property name
   */
  private createPropertyRange(document: TextDocument, decl: DeclarationInfo): Range {
    const vscode = require('vscode');
    const startPos = document.positionAt(decl.propStart);
    const endPos = document.positionAt(decl.propEnd);
    return new vscode.Range(startPos, endPos);
  }

  /**
   * Create a VS Code Range covering specifically the physical value token
   */
  private createValueRange(
    document: TextDocument,
    decl: DeclarationInfo,
    physicalValue: string
  ): Range {
    const vscode = require('vscode');
    const regex = new RegExp(`\\b${this.escapeRegExp(physicalValue)}\\b`, 'i');
    const match = regex.exec(decl.value);
    const indexInValue = match
      ? match.index
      : decl.value.toLowerCase().indexOf(physicalValue.toLowerCase());
    const wordStart = decl.valueStart + (indexInValue >= 0 ? indexInValue : 0);
    const wordEnd = wordStart + physicalValue.length;
    const startPos = document.positionAt(wordStart);
    const endPos = document.positionAt(wordEnd);
    return new vscode.Range(startPos, endPos);
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Create a VS Code Range from declaration info
   */
  private createRange(document: TextDocument, decl: { start: number; end: number }): Range {
    const vscode = require('vscode');
    const startPos = document.positionAt(decl.start);
    const endPos = document.positionAt(decl.end);
    return new vscode.Range(startPos, endPos);
  }

  /**
   * Update the analyzer configuration
   */
  public updateConfig(config: LogicalCssConfig): void {
    this.config = config;
  }
}
