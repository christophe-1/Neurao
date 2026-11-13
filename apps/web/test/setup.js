import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Vide la page et remet fetch d'origine après chaque test
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
