import Link from 'next/link'

export default function Header() {
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
            <li>
              <Link href="/login">Connexion</Link>
            </li>
            <li>
              <Link href="/register" className="nav-cta">
                Inscription
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
