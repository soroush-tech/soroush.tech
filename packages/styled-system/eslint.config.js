import globals from 'globals'
import base from '@soroush.tech/eslint-config/base'

export default [
  ...base,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // TEMPORARY: get() and the Parser call signature are loosened to `any` to
    // match the original @styled-system public types (see core.ts).
    // TODO(next version): restore strict typing and remove this override.
    files: ['src/core/core.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
]
