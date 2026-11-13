import { defineConfig } from 'vitest/config'

// Les tests chargent le même .env que `npm run dev` (--env-file),
// sinon l'ordre des imports déciderait si REDIS_HOST existe déjà
process.loadEnvFile(new URL('../../.env', import.meta.url))

export default defineConfig({})
