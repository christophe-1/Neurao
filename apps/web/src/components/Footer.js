import Link from 'next/link'

/** Site footer with the legal links. */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p>© 2026 Neurao</p>
        <ul className="footer-links">
          <li>
            <Link href="/mentions-legales">Mentions légales</Link>
          </li>
          <li>
            <Link href="/confidentialite">Politique de confidentialité</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
