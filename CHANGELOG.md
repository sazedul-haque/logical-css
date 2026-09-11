# Changelog

All notable changes to the "Logical CSS" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added

- Initial release of Logical CSS extension
- Real-time diagnostics for physical CSS properties
- Quick fix code actions for converting to logical properties
- Hover information showing logical property suggestions
- Status bar displaying current issue count
- Support for ignore comments (`/* rtl-ignore */` and `/* rtl-ignore-next-line */`)
- Comprehensive configuration options
- Support for CSS, SCSS, Less, Vue, Svelte, HTML, and JavaScript/TypeScript files
- Workspace scan command
- Current file scan command
- Output channel for detailed reports
- Unit tests for core functionality

### Features

- Detects physical properties: `margin-left`, `margin-right`, `padding-left`, `padding-right`, `left`, `right`
- Detects border properties: `border-left`, `border-right`, and their variants
- Detects border-radius properties: `border-top-left-radius`, etc.
- Detects direction-sensitive values: `text-align: left/right`, `float: left/right`, etc.
- Suggests modern logical properties: `margin-inline-start`, `inset-inline-start`, etc.
- Handles shorthand properties with appropriate warnings
- Respects user-configured ignore lists for properties and values

### Configuration

- `logicalCss.enable` - Enable/disable diagnostics
- `logicalCss.enableQuickFix` - Enable/disable quick fixes
- `logicalCss.severity` - Set diagnostic severity (error/warning/info/hint)
- `logicalCss.ignoreProperties` - List of properties to ignore
- `logicalCss.ignoreValues` - List of values to ignore
- `logicalCss.enableHover` - Enable/disable hover information
- `logicalCss.enableStatusBar` - Enable/disable status bar
- `logicalCss.autoFixOnSave` - Auto-fix on save (experimental)

### Technical

- Built with TypeScript
- Uses PostCSS with safe parser for robust CSS parsing
- Modular architecture following SOLID principles
- Comprehensive test coverage with Vitest
- ESLint and Prettier for code quality
- VSCE packaging support

## [Unreleased]

### Planned

- CSS-in-JS support (styled-components, Emotion)
- Tailwind CSS utility detection
- Auto-fix on save improvements
- Additional logical property mappings
- Performance optimizations
- More detailed documentation
