import { describe, it, expect, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { QuickFixProvider } from '../../src/codeActions/QuickFixProvider';
import type { CssIssue } from '../../src/types';

describe('QuickFixProvider', () => {
  let provider: QuickFixProvider;

  beforeEach(() => {
    provider = new QuickFixProvider();
  });

  it('should provide quick fix for physical-property issue', () => {
    const docUri = 'file:///test.css';
    const issueRange = new vscode.Range(
      new vscode.Position(1, 2),
      new vscode.Position(1, 13)
    );

    const issues: CssIssue[] = [
      {
        type: 'physical-property',
        physical: 'margin-left',
        logical: 'margin-inline-start',
        reason: 'Use margin-inline-start for RTL support',
        range: issueRange,
        isIgnored: false,
      },
    ];

    provider.setIssues(docUri, issues);

    const mockDoc = { uri: { toString: () => docUri } } as any;
    const actions = provider.provideCodeActions(mockDoc, issueRange, {} as any) as any[];

    expect(actions).toBeDefined();
    const fix = actions.find((a) => a.title.includes("Replace 'margin-left' with 'margin-inline-start'"));
    expect(fix).toBeDefined();
    expect(fix.edit.replacements).toHaveLength(1);
    expect(fix.edit.replacements[0].newText).toBe('margin-inline-start');
    expect(fix.edit.replacements[0].range).toBe(issueRange);
  });

  it('should provide quick fix for direction-value issue (e.g. text-align: left -> start)', () => {
    const docUri = 'file:///test.css';
    const issueRange = new vscode.Range(
      new vscode.Position(2, 14),
      new vscode.Position(2, 18)
    );

    const issues: CssIssue[] = [
      {
        type: 'direction-value',
        physical: 'left',
        logical: 'start',
        reason: 'Use text-align: start for RTL support',
        range: issueRange,
        isIgnored: false,
      },
    ];

    provider.setIssues(docUri, issues);

    const mockDoc = { uri: { toString: () => docUri } } as any;
    const actions = provider.provideCodeActions(mockDoc, issueRange, {} as any) as any[];

    const fix = actions.find((a) => a.title.includes("Replace 'left' with 'start'"));
    expect(fix).toBeDefined();
    expect(fix.edit.replacements[0].newText).toBe('start');
  });

  it('should provide Fix All action when multiple fixable issues exist', () => {
    const docUri = 'file:///test.css';
    const range1 = new vscode.Range(new vscode.Position(1, 2), new vscode.Position(1, 13));
    const range2 = new vscode.Range(new vscode.Position(2, 14), new vscode.Position(2, 18));

    const issues: CssIssue[] = [
      {
        type: 'physical-property',
        physical: 'margin-left',
        logical: 'margin-inline-start',
        reason: 'test',
        range: range1,
        isIgnored: false,
      },
      {
        type: 'direction-value',
        physical: 'left',
        logical: 'start',
        reason: 'test',
        range: range2,
        isIgnored: false,
      },
    ];

    provider.setIssues(docUri, issues);
    const mockDoc = { uri: { toString: () => docUri } } as any;
    const actions = provider.provideCodeActions(mockDoc, range1, {} as any) as any[];

    const fixAll = actions.find((a) => a.title.includes('Fix all'));
    expect(fixAll).toBeDefined();
    expect(fixAll.edit.replacements).toHaveLength(2);
  });

  it('should generate text edits for autoFixOnSave', () => {
    const docUri = 'file:///test.css';
    const range1 = new vscode.Range(new vscode.Position(1, 2), new vscode.Position(1, 13));
    const issues: CssIssue[] = [
      {
        type: 'physical-property',
        physical: 'margin-left',
        logical: 'margin-inline-start',
        reason: 'test',
        range: range1,
        isIgnored: false,
      },
    ];

    provider.setIssues(docUri, issues);
    const mockDoc = { uri: { toString: () => docUri } } as any;
    const edits = provider.getFixableTextEdits(mockDoc) as any[];

    expect(edits).toHaveLength(1);
    expect(edits[0].newText).toBe('margin-inline-start');
  });
});
