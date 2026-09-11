/**
 * Settings - Manages extension configuration
 */

import type { ConfigurationChangeEvent } from 'vscode';
import type { LogicalCssConfig } from '../types';

export class Settings {
  private config: LogicalCssConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Load the current configuration
   */
  private loadConfig(): LogicalCssConfig {
    const workspace = require('vscode').workspace;
    const config = workspace.getConfiguration('logicalCss');

    return {
      enable: config.get('enable', true) as boolean,
      enableQuickFix: config.get('enableQuickFix', true) as boolean,
      severity: config.get('severity', 'warning') as 'error' | 'warning' | 'info' | 'hint',
      ignoreProperties: config.get('ignoreProperties', []) as string[],
      ignoreValues: config.get('ignoreValues', []) as string[],
      enableHover: config.get('enableHover', true) as boolean,
      enableStatusBar: config.get('enableStatusBar', true) as boolean,
      autoFixOnSave: config.get('autoFixOnSave', false) as boolean,
      checkShorthands: config.get('checkShorthands', true) as boolean,
    };
  }

  /**
   * Get the current configuration
   */
  public getConfig(): LogicalCssConfig {
    return this.config;
  }

  /**
   * Reload the configuration
   */
  public reload(): void {
    this.config = this.loadConfig();
  }

  /**
   * Update configuration when it changes
   */
  public onConfigurationChanged(event: ConfigurationChangeEvent): boolean {
    if (event.affectsConfiguration('logicalCss')) {
      this.config = this.loadConfig();
      return true;
    }
    return false;
  }
}
