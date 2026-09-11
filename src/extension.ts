/**
 * Logical CSS Extension
 * Main extension entry point
 */

import type {
  ExtensionContext,
  TextDocument,
  DiagnosticCollection,
  OutputChannel,
  TextDocumentChangeEvent,
  TextDocumentWillSaveEvent,
  TextEdit,
  ConfigurationChangeEvent,
  Progress,
  CancellationToken,
  Uri,
  WorkspaceFolder,
  QuickPickItem,
} from 'vscode';
import { DiagnosticProvider } from './diagnostics/DiagnosticProvider';
import { QuickFixProvider } from './codeActions/QuickFixProvider';
import { LogicalCssHoverProvider } from './hover/HoverProvider';
import { StatusBar } from './statusbar/StatusBar';
import { Settings } from './config/Settings';

let diagnosticProvider: DiagnosticProvider;
let quickFixProvider: QuickFixProvider;
let hoverProvider: LogicalCssHoverProvider;
let statusBar: StatusBar;
let settings: Settings;
let diagnosticCollection: DiagnosticCollection;
let outputChannel: OutputChannel;
let totalIssueCount: number = 0;
const debounceTimers = new Map<string, NodeJS.Timeout>();
const DEBOUNCE_DELAY_MS = 250;

export function activate(context: ExtensionContext): void {
  const vscode = require('vscode');
  const workspace = vscode.workspace;
  const window = vscode.window;
  const languages = vscode.languages;

  // Initialize settings
  settings = new Settings();
  const config = settings.getConfig();

  // Create output channel
  outputChannel = window.createOutputChannel('Logical CSS');

  // Create diagnostic collection
  diagnosticCollection = languages.createDiagnosticCollection('logical-css');

  // Initialize providers
  diagnosticProvider = new DiagnosticProvider(context, diagnosticCollection, config);
  quickFixProvider = new QuickFixProvider();
  hoverProvider = new LogicalCssHoverProvider();
  statusBar = new StatusBar(context);

  // Register code action provider
  if (config.enableQuickFix) {
    context.subscriptions.push(
      languages.registerCodeActionsProvider(
        [
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
        ],
        quickFixProvider,
        {
          providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
        }
      )
    );
  }

  // Register hover provider
  if (config.enableHover) {
    context.subscriptions.push(
      languages.registerHoverProvider(
        [
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
        ],
        hoverProvider
      )
    );
  }

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('logicalCss.scanWorkspace', async () => {
      await scanWorkspace();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('logicalCss.scanCurrentFile', async () => {
      const editor = window.activeTextEditor;
      if (editor) {
        await analyzeDocument(editor.document);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('logicalCss.scanFolder', async (folderUri?: Uri) => {
      await scanFolder(folderUri);
    })
  );

  // Listen to document changes with debounce
  context.subscriptions.push(
    workspace.onDidChangeTextDocument((event: TextDocumentChangeEvent) => {
      if (settings.getConfig().enable) {
        debounceAnalyze(event.document);
      }
    })
  );

  // Listen to document open
  context.subscriptions.push(
    workspace.onDidOpenTextDocument((document: TextDocument) => {
      if (settings.getConfig().enable) {
        analyzeDocument(document);
      }
    })
  );

  // Listen to document save
  context.subscriptions.push(
    workspace.onDidSaveTextDocument((document: TextDocument) => {
      if (settings.getConfig().enable) {
        analyzeDocument(document);
      }
    })
  );

  // Listen to document close to prevent memory leaks
  context.subscriptions.push(
    workspace.onDidCloseTextDocument((document: TextDocument) => {
      const uri = document.uri.toString();
      const existingTimer = debounceTimers.get(uri);
      if (existingTimer) {
        clearTimeout(existingTimer);
        debounceTimers.delete(uri);
      }
      diagnosticCollection.delete(document.uri);
      quickFixProvider.clearIssues(uri);
      updateIssueCount();
    })
  );

  // Auto-fix on save
  context.subscriptions.push(
    workspace.onWillSaveTextDocument((event: TextDocumentWillSaveEvent) => {
      const currentConfig = settings.getConfig();
      if (!currentConfig.enable || !currentConfig.autoFixOnSave) {
        return;
      }

      if (!isSupportedDocument(event.document)) {
        return;
      }

      const uri = event.document.uri.toString();
      const existingTimer = debounceTimers.get(uri);
      if (existingTimer) {
        clearTimeout(existingTimer);
        debounceTimers.delete(uri);
      }

      // Analyze document to ensure fresh issues
      const issues = diagnosticProvider.analyzeDocument(event.document);
      quickFixProvider.setIssues(uri, issues);

      const edits = quickFixProvider.getFixableTextEdits(event.document) as TextEdit[];
      if (edits && edits.length > 0) {
        event.waitUntil(Promise.resolve(edits));
      }
    })
  );

  // Listen to configuration changes
  context.subscriptions.push(
    workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
      if (settings.onConfigurationChanged(event)) {
        const newConfig = settings.getConfig();
        diagnosticProvider.updateConfig(newConfig);

        // Update status bar visibility
        if (newConfig.enableStatusBar) {
          statusBar.show();
        } else {
          statusBar.hide();
        }

        outputChannel.appendLine('Configuration updated');
      }
    })
  );

  // Analyze all currently open documents
  if (config.enable) {
    workspace.textDocuments.forEach((doc: TextDocument) => {
      analyzeDocument(doc);
    });
  }

  // Update status bar visibility
  if (!config.enableStatusBar) {
    statusBar.hide();
  }

  outputChannel.appendLine('Logical CSS extension activated');
}

const SUPPORTED_LANGUAGES = [
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

function isSupportedDocument(document: TextDocument): boolean {
  return SUPPORTED_LANGUAGES.includes(document.languageId);
}

function debounceAnalyze(document: TextDocument): void {
  if (!isSupportedDocument(document)) {
    return;
  }

  const uri = document.uri.toString();
  const existingTimer = debounceTimers.get(uri);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(() => {
    debounceTimers.delete(uri);
    analyzeDocument(document);
  }, DEBOUNCE_DELAY_MS);

  debounceTimers.set(uri, timer);
}

async function analyzeDocument(document: TextDocument): Promise<void> {
  if (!isSupportedDocument(document)) {
    return;
  }

  try {
    // Single-pass analysis and diagnostic publication
    const issues = diagnosticProvider.analyzeDocument(document);

    // Update quick fix provider
    quickFixProvider.setIssues(document.uri.toString(), issues);

    // Update total issue count
    updateIssueCount();
  } catch (error) {
    outputChannel.appendLine(`Error analyzing ${document.fileName}: ${error}`);
    outputChannel.appendLine(`Stack: ${error instanceof Error ? error.stack : 'unknown'}`);
  }
}

let isScanning = false;

async function scanWorkspace(): Promise<void> {
  const vscode = require('vscode');
  const path = require('path');
  const window = vscode.window;
  const workspace = vscode.workspace;

  if (isScanning) {
    window.showWarningMessage('Logical CSS: A workspace scan is already in progress.');
    return;
  }

  await window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Logical CSS: Scanning workspace',
      cancellable: true,
    },
    async (
      progress: Progress<{ message?: string; increment?: number }>,
      token: CancellationToken
    ) => {
      isScanning = true;
      outputChannel.appendLine('Scanning workspace...');

      try {
        const files = await workspace.findFiles(
          '**/*.{css,scss,less}',
          '**/{node_modules,dist,out,.git}/**'
        );

        if (files.length === 0) {
          window.showInformationMessage('Logical CSS: No stylesheet files found to scan.');
          return;
        }

        let scanned = 0;
        for (const file of files) {
          if (token.isCancellationRequested) {
            outputChannel.appendLine('Workspace scan cancelled by user.');
            break;
          }

          progress.report({
            message: `${++scanned}/${files.length} (${path.basename(file.fsPath)})`,
            increment: (1 / files.length) * 100,
          });

          try {
            const document = await workspace.openTextDocument(file);
            const issues = diagnosticProvider.analyzeDocument(document);
            quickFixProvider.setIssues(document.uri.toString(), issues);
          } catch (error) {
            outputChannel.appendLine(`Error scanning ${file.fsPath}: ${error}`);
          }
        }

        updateIssueCount();

        if (!token.isCancellationRequested) {
          outputChannel.appendLine(
            `Workspace scan complete. Analyzed ${scanned} files. Total issues: ${totalIssueCount}`
          );
          const message = `Logical CSS: Scan complete. Analyzed ${scanned} files, found ${totalIssueCount} issues.`;
          if (totalIssueCount > 0) {
            window
              .showInformationMessage(message, 'View Problems')
              .then((action: string | undefined) => {
                if (action === 'View Problems') {
                  vscode.commands.executeCommand('workbench.action.problems.focus');
                }
              });
          } else {
            window.showInformationMessage(message);
          }
        }
      } finally {
        isScanning = false;
      }
    }
  );
}

async function scanFolder(targetUri?: Uri): Promise<void> {
  const vscode = require('vscode');
  const window = vscode.window;
  const workspace = vscode.workspace;
  const path = require('path');

  let folderUri = targetUri;

  // If invoked from Command Palette without an argument, prompt the user
  if (!folderUri) {
    const workspaceFolders = workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length === 1) {
      folderUri = workspaceFolders[0].uri;
    } else if (workspaceFolders && workspaceFolders.length > 1) {
      const items: Array<QuickPickItem & { uri: Uri }> = workspaceFolders.map(
        (wf: WorkspaceFolder) => ({
          label: wf.name,
          description: wf.uri.fsPath,
          uri: wf.uri,
        })
      );
      const selected = await window.showQuickPick(items, {
        placeHolder: 'Select folder to scan with Logical CSS',
      });
      if (!selected) {
        return;
      }
      folderUri = selected.uri;
    } else {
      const selected = await window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Scan Folder',
      });
      if (!selected || selected.length === 0) {
        return;
      }
      folderUri = selected[0];
    }
  }

  if (!folderUri) {
    return;
  }

  if (isScanning) {
    window.showWarningMessage(
      'Logical CSS is already scanning files. Please wait for the current scan to finish.'
    );
    return;
  }

  const folderName = path.basename(folderUri.fsPath) || folderUri.fsPath;

  await window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Logical CSS: Scanning folder '${folderName}'`,
      cancellable: true,
    },
    async (
      progress: Progress<{ message?: string; increment?: number }>,
      token: CancellationToken
    ) => {
      isScanning = true;
      outputChannel.appendLine(`Scanning folder: ${folderUri?.fsPath}...`);

      try {
        const pattern = new vscode.RelativePattern(folderUri, '**/*.{css,scss,less}');
        const files = await workspace.findFiles(
          pattern,
          '**/{node_modules,dist,out,.git}/**'
        );

        if (files.length === 0) {
          window.showInformationMessage(
            `Logical CSS: No stylesheet files found in folder '${folderName}'.`
          );
          return;
        }

        let scanned = 0;
        let folderIssues = 0;
        for (const file of files) {
          if (token.isCancellationRequested) {
            outputChannel.appendLine('Folder scan cancelled by user.');
            break;
          }

          progress.report({
            message: `${++scanned}/${files.length} (${path.basename(file.fsPath)})`,
            increment: (1 / files.length) * 100,
          });

          try {
            const document = await workspace.openTextDocument(file);
            const issues = diagnosticProvider.analyzeDocument(document);
            folderIssues += issues.length;
            quickFixProvider.setIssues(document.uri.toString(), issues);
          } catch (error) {
            outputChannel.appendLine(`Error scanning ${file.fsPath}: ${error}`);
          }
        }

        updateIssueCount();

        if (!token.isCancellationRequested) {
          outputChannel.appendLine(
            `Folder scan complete. Analyzed ${scanned} files in '${folderName}'. Found ${folderIssues} issues.`
          );
          const message = `Logical CSS: Scan complete for '${folderName}'. Analyzed ${scanned} files, found ${folderIssues} issues.`;
          if (folderIssues > 0) {
            window
              .showInformationMessage(message, 'View Problems')
              .then((action: string | undefined) => {
                if (action === 'View Problems') {
                  vscode.commands.executeCommand('workbench.action.problems.focus');
                }
              });
          } else {
            window.showInformationMessage(message);
          }
        }
      } finally {
        isScanning = false;
      }
    }
  );
}

function updateIssueCount(): void {
  let count = 0;
  diagnosticCollection.forEach((_uri, diagnostics) => {
    if (diagnostics) {
      count += diagnostics.length;
    }
  });

  totalIssueCount = count;
  statusBar.update(count);
}

export function deactivate(): void {
  for (const timer of debounceTimers.values()) {
    clearTimeout(timer);
  }
  debounceTimers.clear();

  if (diagnosticCollection) {
    diagnosticCollection.dispose();
  }
  if (outputChannel) {
    outputChannel.dispose();
  }
  if (statusBar) {
    statusBar.dispose();
  }
}
