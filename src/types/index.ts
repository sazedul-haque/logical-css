/**
 * Type definitions for Logical CSS extension
 */

import type { Range } from 'vscode';

/**
 * Represents a CSS rule that can be converted to a logical property
 */
export interface LogicalPropertyRule {
  /** The physical property name */
  physical: string;
  /** The logical property name to suggest */
  logical: string;
  /** The type of rule (property or value) */
  type: 'property' | 'value';
  /** Description of why this should be converted */
  reason: string;
}

/**
 * Represents a CSS value that is direction-sensitive
 */
export interface DirectionSensitiveValue {
  /** The property name */
  property: string;
  /** The physical value */
  physical: string;
  /** The logical value to suggest */
  logical: string;
  /** Description of why this should be converted */
  reason: string;
}

/**
 * Represents a CSS issue found during analysis
 */
export interface CssIssue {
  /** The type of issue */
  type: 'physical-property' | 'direction-value';
  /** The physical property or value */
  physical: string;
  /** The suggested logical alternative */
  logical: string;
  /** The reason for the suggestion */
  reason: string;
  /** The range in the document where the issue occurs */
  range: Range;
  /** Whether this issue is ignored by comments */
  isIgnored: boolean;
}

/**
 * Represents the result of parsing CSS
 */
export interface ParseResult {
  /** The issues found */
  issues: CssIssue[];
  /** Whether the parsing was successful */
  success: boolean;
  /** Any error message if parsing failed */
  error?: string;
}

/**
 * Configuration settings for the extension
 */
export interface LogicalCssConfig {
  /** Enable diagnostics */
  enable: boolean;
  /** Enable quick fix code actions */
  enableQuickFix: boolean;
  /** Severity level for diagnostics */
  severity: 'error' | 'warning' | 'info' | 'hint';
  /** Properties to ignore */
  ignoreProperties: string[];
  /** Values to ignore */
  ignoreValues: string[];
  /** Enable hover information */
  enableHover: boolean;
  /** Enable status bar */
  enableStatusBar: boolean;
  /** Auto-fix on save */
  autoFixOnSave: boolean;
  /** Check shorthand properties for asymmetrical horizontal values */
  checkShorthands: boolean;
}

/**
 * Represents a declaration in the CSS AST
 */
export interface DeclarationInfo {
  /** The property name */
  property: string;
  /** The property value */
  value: string;
  /** The start position */
  start: number;
  /** The end position */
  end: number;
  /** The property name start offset */
  propStart: number;
  /** The property name end offset */
  propEnd: number;
  /** The property value start offset */
  valueStart: number;
  /** The property value end offset */
  valueEnd: number;
  /** The line number */
  line: number;
  /** The column number */
  column: number;
}
