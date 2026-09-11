# Setup Guide

This guide will help you set up the Logical CSS extension for development and packaging.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- VS Code
- vsce (VS Code Extension Manager)

## Installation Steps

### 1. Resolve npm Cache Issue (if encountered)

If you encountered an `EACCES` permission error during `npm install`, run:

```bash
# Clean npm cache
sudo npm cache clean --force

# Or manually remove the cache directory
rm -rf ~/.npm/_cacache
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- TypeScript and type definitions
- PostCSS and postcss-safe-parser
- ESLint and Prettier
- Vitest for testing
- vsce for packaging

### 3. Compile the Project

```bash
npm run compile
```

This compiles the TypeScript source files to the `out/` directory.

### 4. Run Tests

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### 5. Lint and Format

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### 6. Package the Extension

```bash
npm run package
```

This will generate a `.vsix` file that can be installed in VS Code.

## Development

### Watch Mode

For development with auto-recompilation:

```bash
npm run watch
```

### Debugging

1. Open the project in VS Code
2. Press F5 to launch the extension in a new VS Code window
3. The extension will be loaded from the `out/` directory

## Project Structure

```
logical-css/
├── src/
│   ├── extension.ts              # Main entry point
│   ├── parser/
│   │   └── PostCssParser.ts       # CSS parsing logic
│   ├── diagnostics/
│   │   ├── Rules.ts              # Physical to logical property mappings
│   │   ├── CssAnalyzer.ts        # CSS analysis logic
│   │   └── DiagnosticProvider.ts # VS Code diagnostics
│   ├── codeActions/
│   │   └── QuickFixProvider.ts   # Code actions for quick fixes
│   ├── hover/
│   │   └── HoverProvider.ts      # Hover information
│   ├── statusbar/
│   │   └── StatusBar.ts          # Status bar component
│   ├── config/
│   │   └── Settings.ts           # Configuration management
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── tests/
│   ├── diagnostics/
│   │   └── Rules.test.ts
│   ├── parser/
│   │   └── PostCssParser.test.ts
│   └── diagnostics/
│       └── CssAnalyzer.test.ts
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript configuration
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── vitest.config.ts              # Vitest configuration
├── README.md                     # User documentation
├── CHANGELOG.md                  # Version history
├── LICENSE                       # MIT License
└── .vscodeignore                 # Files to exclude from package
```

## Publishing to VS Code Marketplace

### 1. Create a Publisher Account

1. Go to [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
2. Sign in with your Microsoft/GitHub account
3. Create a publisher account

### 2. Update package.json

Update the following fields in `package.json`:

```json
{
  "publisher": "sazedul-haque",
  "repository": {
    "type": "git",
    "url": "https://github.com/sazedul-haque/logical-css"
  },
  "bugs": {
    "url": "https://github.com/sazedul-haque/logical-css/issues"
  },
  "homepage": "https://github.com/sazedul-haque/logical-css#readme"
}
```

### 3. Create a Personal Access Token

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Create a personal access token with "Marketplace: Manage" scope
3. Save the token

### 4. Publish

```bash
# Install vsce globally if not already installed
npm install -g @vscode/vsce

# Login with your token
vsce login sazedul-haque

# Publish
vsce publish
```

Or publish a specific version:

```bash
vsce publish 1.0.0
```

## Troubleshooting

### TypeScript Errors After Installation

If you see TypeScript errors after installing dependencies:

1. Ensure all dependencies are installed: `npm install`
2. Restart VS Code
3. Run `npm run compile` to verify compilation

### PostCSS Import Errors

If you see errors related to PostCSS imports:

1. Verify `postcss` and `postcss-safe-parser` are installed
2. Check that `node_modules` exists
3. Try reinstalling: `rm -rf node_modules && npm install`

### Test Failures

If tests fail:

1. Ensure all dependencies are installed
2. Run `npm run compile` first
3. Check the test output for specific errors

### Packaging Errors

If `vsce package` fails:

1. Ensure the project compiles: `npm run compile`
2. Check that `out/` directory exists and contains compiled files
3. Verify `package.json` is valid
4. Check that all required fields are present in `package.json`

## Additional Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [PostCSS Documentation](https://postcss.org/)
- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [vsce Documentation](https://github.com/microsoft/vscode-vsce)
