import Image from 'next/image'
import Link from 'next/link'
import FeaturedProducts from '@/components/FeaturedProducts'

/** Home page: presentation of the brand and a few products of the range. */
export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <p className="kicker">Compléments alimentaires pour enfants</p>
          <h1>La nutrition, version enfant</h1>
          <p className="lead">
            Des formules simples, imaginées à partir du livre de la Dr Julie Jortay, en gélules,
            gommes et liquides que les enfants prennent volontiers.
          </p>
          <Link href="/products" className="button">
            Découvrir la gamme
          </Link>
          <ul className="pill-list">
            <li className="pill">Arômes naturels</li>
            <li className="pill">Sans colorants artificiels</li>
            <li className="pill">0 % édulcorant</li>
          </ul>
        </div>

        <div className="hero-visual">
          <Image
            src="/images/products/focus.png"
            alt=""
            width={220}
            height={220}
            className="hero-small"
          />
          <Image
            src="/images/products/vital.png"
            alt=""
            width={300}
            height={300}
            className="hero-big"
          />
        </div>
      </section>

      <FeaturedProducts />
    </main>
  )
}
