'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fetchMe, logout } from '@/lib/api'

/** Site header. Asks /me to show either the login link or the logout button. */
export default function Header() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: me, isPending } = useQuery({ queryKey: ['me'], queryFn: fetchMe })

  async function handleLogout() {
    await logout()
    queryClient.setQueryData(['me'], null)
    router.push('/')
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          <Image src="/images/logo-neurao.svg" alt="neuraO, accueil" width={64} height={64} />
        </Link>

        <nav aria-label="Navigation principale" className="site-nav">
          <Link href="/products">La gamme</Link>
        </nav>

        <form action="/search" className="header-search">
          <button type="submit" aria-label="Rechercher">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.75" />
              <path d="M16 16l5 5" fill="none" stroke="currentColor" strokeWidth="1.75" />
            </svg>
          </button>
          <input
            name="query"
            type="search"
            placeholder="Rechercher un produit"
            aria-label="Rechercher un produit"
            maxLength={100}
            required
          />
        </form>

        <div className="site-actions">
          {!isPending && me && (
            <button type="button" className="button-secondary" onClick={handleLogout}>
              Déconnexion
            </button>
          )}
          {!isPending && !me && (
            <Link href="/login" className="account-link">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.75" />
                <path
                  d="M4 21c0-4 3.6-7 8-7s8 3 8 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                />
              </svg>
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
