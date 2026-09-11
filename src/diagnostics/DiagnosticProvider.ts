/**
 * Diagnostic Provider - Provides VS Code diagnostics for CSS issues
 */

import type {
  DiagnosticCollection,
  TextDocument,
  ExtensionContext,
  Diagnostic,
} from 'vscode';
import { CssAnalyzer } from './CssAnalyzer';
import type { LogicalCssConfig, CssIssue } from '../types';

export class DiagnosticProvider {
  private diagnosticCollection: DiagnosticCollection;
  private analyzer: CssAnalyzer;
  private config: LogicalCssConfig;

  constructor(
    _context: ExtensionContext,
    diagnosticCollection: DiagnosticCollection,
    config: LogicalCssConfig
  ) {
    this.diagnosticCollection = diagnosticCollection;
    this.analyzer = new CssAnalyzer(config);
    this.config = config;
  }

  /**
   * Analyze a document and publish diagnostics
   */
  public analyzeDocument(document: TextDocument): CssIssue[] {
    if (!this.isSupportedDocument(document)) {
      this.diagnosticCollection.delete(document.uri);
      return [];
    }

    const issues = this.analyzer.analyze(document);
    const diagnostics = this.createDiagnostics(issues);

    this.diagnosticCollection.set(document.uri, diagnostics);
    return issues;
  }

  /**
   * Clear diagnostics for a document
   */
  public clearDiagnostics(document: TextDocument): void {
    this.diagnosticCollection.delete(document.uri);
  }

  /**
   * Clear all diagnostics
   */
  public clearAll(): void {
    this.diagnosticCollection.clear();
  }

  /**
   * Check if a document is supported
   */
  private isSupportedDocument(document: TextDocument): boolean {
    const supportedLanguages = [
      'css',
      'scss',
      'less',
      'vue',
      'svelte',
      'html',
      'javascript',
      'javascriptreact',
      'typescript',
      'typescriptreact',
    ];
    return supportedLanguages.includes(document.languageId);
  }

  /**
   * Create VS Code diagnostics from CSS issues
   */
  private createDiagnostics(issues: CssIssue[]): Diagnostic[] {
    const Diagnostic = require('vscode').Diagnostic;
    const DiagnosticSeverity = require('vscode').DiagnosticSeverity;

    const severityMap = {
      error: DiagnosticSeverity.Error,
      warning: DiagnosticSeverity.Warning,
      info: DiagnosticSeverity.Info,
      hint: DiagnosticSeverity.Hint,
    };

    return issues.map((issue) => {
      const diagnostic = new Diagnostic(
        issue.range,
        `${issue.reason}. Consider using '${issue.logical}' instead of '${issue.physical}'.`,
        severityMap[this.config.severity]
      );

      diagnostic.code = 'logical-css';
      diagnostic.source = 'Logical CSS';

      return diagnostic;
    });
  }

  /**
   * Update the configuration
   */
  public updateConfig(config: LogicalCssConfig): void {
    this.config = config;
    this.analyzer.updateConfig(config);
  }

  /**
   * Get the analyzer instance
   */
  public getAnalyzer(): CssAnalyzer {
    return this.analyzer;
  }
}
