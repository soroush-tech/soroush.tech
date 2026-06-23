import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

/**
 * Shared, framework-agnostic ESLint base for every workspace member.
 * Consumers layer their own environment/framework rules on top
 * (e.g. apps/web adds React, Storybook, and browser globals).
 */
const config = tseslint.config(
  { ignores: ['dist', 'build', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      ...prettierConfig.rules,
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportDeclaration[source.value=/\\.tsx?$/]',
          message: 'Do not include .ts, .js, jsx, .tsx extensions in import paths.',
        },
      ],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'lf',
        },
      ],
    },
  }
)

export default config
