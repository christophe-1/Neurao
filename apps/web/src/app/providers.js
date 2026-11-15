'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/cartStore'

/** Gives the TanStack Query cache to every page and loads the saved cart once the page is shown. */
export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
