import Module from 'module';
import * as mockVscode from './mocks/vscode';

// Intercept CJS require('vscode') calls in node environment
const originalRequire = (Module.prototype as any).require;
(Module.prototype as any).require = function (path: string, ...args: any[]) {
  if (path === 'vscode') {
    return mockVscode.default || mockVscode;
  }
  return originalRequire.apply(this, [path, ...args]);
};
