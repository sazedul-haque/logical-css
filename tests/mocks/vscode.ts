export class Position {
  constructor(public line: number, public character: number) {}
}

export class Range {
  constructor(public start: Position, public end: Position) {}

  intersection(other: Range): Range | undefined {
    if (
      this.end.line < other.start.line ||
      this.start.line > other.end.line ||
      (this.end.line === other.start.line && this.end.character < other.start.character) ||
      (this.start.line === other.end.line && this.start.character > other.end.character)
    ) {
      return undefined;
    }
    return this;
  }
}

export class CodeAction {
  public edit?: WorkspaceEdit;
  public isPreferred = false;
  constructor(public title: string, public kind: any) {}
}

export const CodeActionKind = {
  QuickFix: { value: 'quickfix' },
  SourceFixAll: {
    value: 'source.fixAll',
    append: (suffix: string) => ({ value: `source.fixAll.${suffix}` }),
  },
};

export class WorkspaceEdit {
  public replacements: Array<{ uri: any; range: Range; newText: string }> = [];
  replace(uri: any, range: Range, newText: string) {
    this.replacements.push({ uri, range, newText });
  }
}

export const TextEdit = {
  replace(range: Range, newText: string) {
    return { range, newText };
  },
};

export class Diagnostic {
  public code?: string;
  public source?: string;
  constructor(
    public range: Range,
    public message: string,
    public severity?: number
  ) {}
}

export const DiagnosticSeverity = {
  Error: 0,
  Warning: 1,
  Info: 2,
  Hint: 3,
};

export default {
  Position,
  Range,
  CodeAction,
  CodeActionKind,
  WorkspaceEdit,
  TextEdit,
  Diagnostic,
  DiagnosticSeverity,
};
