/**
 * Quick Fix Provider - Provides code actions for converting physical properties to logical properties
 */

import type {
  CodeAction,
  CodeActionContext,
  CodeActionProvider,
  ProviderResult,
  TextDocument,
  TextEdit,
  WorkspaceEdit,
  Range,
} from 'vscode';
import type { CssIssue } from '../types';

export class QuickFixProvider implements CodeActionProvider {
  private issues: Map<string, CssIssue[]> = new Map();

  /**
   * Set the current issues for a document
   */
  public setIssues(documentUri: string, issues: CssIssue[]): void {
    this.issues.set(documentUri, issues);
  }

  /**
   * Provide code actions for the given range
   */
  public provideCodeActions(
    document: TextDocument,
    range: Range,
    _context: CodeActionContext
  ): ProviderResult<CodeAction[]> {
    const CodeAction = require('vscode').CodeAction;
    const CodeActionKind = require('vscode').CodeActionKind;
    const WorkspaceEdit = require('vscode').WorkspaceEdit;

    const documentUri = document.uri.toString();
    const documentIssues = this.issues.get(documentUri) ?? [];

    const actions: CodeAction[] = [];
    const fixableIssuesInDoc: CssIssue[] = [];

    for (const issue of documentIssues) {
      if (issue.logical !== issue.physical) {
        fixableIssuesInDoc.push(issue);
      }

      // Check if the issue intersects with the selected range
      if (this.rangesIntersect(issue.range, range)) {
        if (issue.logical !== issue.physical) {
          const action = new CodeAction(
            `Replace '${issue.physical}' with '${issue.logical}'`,
            CodeActionKind.QuickFix
          );
          action.edit = new WorkspaceEdit();
          action.edit.replace(document.uri, issue.range, issue.logical);
          action.isPreferred = true;
          actions.push(action);
        }
      }
    }

    // Add "Fix all Logical CSS issues in file" if there are multiple fixable issues
    if (fixableIssuesInDoc.length > 0) {
      const fixAllKind = CodeActionKind.SourceFixAll
        ? CodeActionKind.SourceFixAll.append('logicalCss')
        : CodeActionKind.QuickFix;

      const fixAllSourceAction = new CodeAction(
        'Fix all Logical CSS issues in file',
        fixAllKind
      );
      fixAllSourceAction.edit = this.createFixAllEdit(document, fixableIssuesInDoc);
      actions.push(fixAllSourceAction);

      if (fixableIssuesInDoc.length > 1) {
        const fixAllQuickFix = new CodeAction(
          `Fix all ${fixableIssuesInDoc.length} Logical CSS issues in file`,
          CodeActionKind.QuickFix
        );
        fixAllQuickFix.edit = this.createFixAllEdit(document, fixableIssuesInDoc);
        actions.push(fixAllQuickFix);
      }
    }

    return actions;
  }

  /**
   * Create a WorkspaceEdit that fixes all fixable issues in the document
   */
  public createFixAllEdit(document: TextDocument, issues?: CssIssue[]): WorkspaceEdit {
    const WorkspaceEdit = require('vscode').WorkspaceEdit;
    const edit = new WorkspaceEdit();
    const targetIssues = (issues ?? this.issues.get(document.uri.toString()) ?? []).filter(
      (issue) => issue.logical !== issue.physical
    );

    const sortedIssues = [...targetIssues].sort((a, b) => {
      if (a.range.start.line !== b.range.start.line) {
        return b.range.start.line - a.range.start.line;
      }
      return b.range.start.character - a.range.start.character;
    });

    for (const issue of sortedIssues) {
      edit.replace(document.uri, issue.range, issue.logical);
    }

    return edit;
  }

  /**
   * Get TextEdits for all fixable issues in a document (used by autoFixOnSave)
   */
  public getFixableTextEdits(document: TextDocument): TextEdit[] {
    const TextEdit = require('vscode').TextEdit;
    const documentIssues = (this.issues.get(document.uri.toString()) ?? []).filter(
      (issue) => issue.logical !== issue.physical
    );

    const sortedIssues = [...documentIssues].sort((a, b) => {
      if (a.range.start.line !== b.range.start.line) {
        return b.range.start.line - a.range.start.line;
      }
      return b.range.start.character - a.range.start.character;
    });

    return sortedIssues.map((issue) => TextEdit.replace(issue.range, issue.logical));
  }

  /**
   * Check if two ranges intersect
   */
  private rangesIntersect(range1: Range, range2: Range): boolean {
    return range1.intersection(range2) !== undefined;
  }

  /**
   * Clear issues for a document
   */
  public clearIssues(documentUri: string): void {
    this.issues.delete(documentUri);
  }

  /**
   * Clear all issues
   */
  public clearAllIssues(): void {
    this.issues.clear();
  }
}
