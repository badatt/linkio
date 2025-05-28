import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginSecurity from 'eslint-plugin-security';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';

/** @type {import("eslint").Linter.FlatConfig} */
export default [
  js.configs.recommended,

  // API config
  {
    files: ['api/**/*.{ts,tsx}'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: './api/tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2022,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
      import: pluginImport,
      security: pluginSecurity,
    },
    rules: {
      ...eslintPluginTs.configs.recommended.rules,
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        },
      ],
      'import/no-unresolved': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './packages/api/tsconfig.json',
        },
      },
    },
  },

  // App config (if using React)
  {
    files: ['app/**/*.{ts,tsx}'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: './app/tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2022,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
      import: pluginImport,
    },
    rules: {
      ...eslintPluginTs.configs.recommended.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: './packages/app/tsconfig.json',
        },
      },
    },
  },

  // Infra config
  {
    files: ['infra/**/*.{ts,tsx}'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: './infra/tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2022,
      },
      globals: {
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
      import: pluginImport,
    },
    rules: {
      ...eslintPluginTs.configs.recommended.rules,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './packages/infra/tsconfig.json',
        },
      },
    },
  },

  // Ignore common folders
  {
    ignores: ['**/dist/**', '**/build/**', '**/node_modules/**', '**/cdk.out/**', '**/.next/**'],
  },

  prettier,
];
