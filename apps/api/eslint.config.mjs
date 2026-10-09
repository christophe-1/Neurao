import js from '@eslint/js'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier/flat'
import { sharedRules } from '../../eslint.shared.mjs'

export default defineConfig([
  globalIgnores(['coverage/**']),
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: globals.node },
    rules: sharedRules,
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'commonjs', globals: globals.node },
    rules: sharedRules,
  },
  {
    // Les tailles de colonnes (STRING(100)…) sont des nombres attendus dans une migration ou un modèle
    files: [
      'src/infrastructure/database/migrations/**',
      'src/infrastructure/database/seeders/**',
      'src/infrastructure/database/models/**',
    ],
    rules: { 'no-magic-numbers': 'off' },
  },
  prettier,
])
