'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fetchMe, logout } from '@/lib/api'

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
          neuraO
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="site-nav">
            <li>
              <Link href="/products">Catalogue</Link>
            </li>
            {!isPending && me && (
              <li>
                <button type="button" className="nav-cta" onClick={handleLogout}>
                  Déconnexion
                </button>
              </li>
            )}
            {!isPending && !me && (
              <>
                <li>
                  <Link href="/login">Connexion</Link>
                </li>
                <li>
                  <Link href="/register" className="nav-cta">
                    Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
