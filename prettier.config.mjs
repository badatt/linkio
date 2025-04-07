/** @type {import('prettier').Config} */
export default {
  // Add semicolons at the ends of statements
  semi: true,

  // Use single quotes instead of double
  singleQuote: true,

  // Always include parens around arrow function arguments
  arrowParens: 'always',

  // Set line length limit
  printWidth: 120,

  // Use spaces over tabs
  useTabs: false,

  // Set number of spaces per indentation-level
  tabWidth: 2,

  // Print trailing commas wherever possible (ES5+)
  trailingComma: 'all',

  // Print spaces between brackets in object literals
  bracketSpacing: true,

  // Place the `>` of a multi-line JSX element at the end of the last line
  bracketSameLine: false,

  // Format quoted code embedded in the file (like HTML in markdown)
  embeddedLanguageFormatting: 'auto',

  // Wrap prose as-is (good for markdown docs)
  proseWrap: 'preserve',

  // Keep line endings consistent (good for cross-OS work)
  endOfLine: 'lf',
};
