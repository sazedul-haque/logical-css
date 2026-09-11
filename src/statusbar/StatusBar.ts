/**
 * Status Bar - Displays the status of Logical CSS analysis
 */

import type { StatusBarItem, ExtensionContext } from 'vscode';

export class StatusBar {
  private statusBarItem: StatusBarItem;

  constructor(context: ExtensionContext) {
    const window = require('vscode').window;
    this.statusBarItem = window.createStatusBarItem(
      'logical-css-status',
      require('vscode').StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = 'workbench.action.problems.focus';
    this.statusBarItem.show();
    context.subscriptions.push(this.statusBarItem);
  }

  /**
   * Update the status bar with the current issue count
   */
  public update(issueCount: number): void {
    if (issueCount === 0) {
      this.statusBarItem.text = '$(check) Logical CSS';
      this.statusBarItem.tooltip = 'Logical CSS: No physical CSS properties found';
    } else {
      this.statusBarItem.text = `$(warning) Logical CSS: ${issueCount} issue${issueCount > 1 ? 's' : ''}`;
      this.statusBarItem.tooltip = `Logical CSS: ${issueCount} issue${issueCount > 1 ? 's' : ''} found. Click to view in Problems panel.`;
    }
  }

  /**
   * Hide the status bar
   */
  public hide(): void {
    this.statusBarItem.hide();
  }

  /**
   * Show the status bar
   */
  public show(): void {
    this.statusBarItem.show();
  }

  /**
   * Dispose the status bar
   */
  public dispose(): void {
    this.statusBarItem.dispose();
  }
}
