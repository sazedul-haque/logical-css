/**
 * Hover Provider - Provides hover information for physical CSS properties
 */

import type {
  Hover,
  HoverProvider,
  TextDocument,
  Position,
  ProviderResult,
} from 'vscode';
import { isPhysicalProperty, getLogicalProperty } from '../diagnostics/Rules';

export class LogicalCssHoverProvider implements HoverProvider {
  /**
   * Provide hover information for the given position
   */
  public provideHover(
    document: TextDocument,
    position: Position,
    _token: unknown
  ): ProviderResult<Hover> {
    const Hover = require('vscode').Hover;
    const MarkdownString = require('vscode').MarkdownString;

    const wordRange = document.getWordRangeAtPosition(position, /[\w-]+/);
    if (!wordRange) {
      return undefined;
    }

    const word = document.getText(wordRange);

    // Check if this is a physical property
    if (isPhysicalProperty(word)) {
      const rule = getLogicalProperty(word);
      if (rule) {
        const markdown = new MarkdownString();
        markdown.appendMarkdown(`**Physical property**\n\n`);
        markdown.appendMarkdown(`Consider using: \`${rule.logical}\`\n\n`);
        markdown.appendMarkdown(`**Reason:**\n\n`);
        markdown.appendMarkdown(`${rule.reason}\n\n`);
        markdown.appendMarkdown(`---\n\n`);
        markdown.appendMarkdown(
          `Logical properties automatically adapt to RTL and writing modes.`
        );

        return new Hover(markdown, wordRange);
      }
    }

    return undefined;
  }
}
