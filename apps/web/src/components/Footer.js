import Image from 'next/image'
import Link from 'next/link'

/** Site footer: the brand, the shop and legal links, and the delivery countries. */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <Image src="/images/logo-neurao.svg" alt="" width={64} height={64} />
          <p>
            Compléments alimentaires pour enfants, imaginés à partir du livre de la Dr Julie Jortay.
          </p>
        </div>

        <nav aria-label="La boutique" className="footer-column">
          <p className="footer-title">La boutique</p>
          <Link href="/products">La gamme</Link>
        </nav>

        <nav aria-label="Informations" className="footer-column">
          <p className="footer-title">Informations</p>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>© 2026 neuraO</p>
        <p>Livraison en France, en Belgique, en Suisse et au Luxembourg</p>
      </div>
    </footer>
  )
}
