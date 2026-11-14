import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'
import { sharedRules } from '../../eslint.shared.mjs'

export default defineConfig([
  ...nextVitals,
  { rules: sharedRules },
  {
    // Un test est fait de valeurs d'exemple : les nommer n'apporterait rien
    files: ['test/**'],
    rules: { 'no-magic-numbers': 'off' },
  },
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
