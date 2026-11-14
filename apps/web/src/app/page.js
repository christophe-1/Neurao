import Link from 'next/link'
import FeaturedProducts from '@/components/FeaturedProducts'

/** Home page: presentation of the brand and three featured products. */
export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>La nutrition, version enfant</h1>
        <p>
          Des formules simples et lisibles, livrées en France, en Belgique, en Suisse et au
          Luxembourg.
        </p>
        <Link href="/products" className="hero-cta">
          Découvrir la gamme
        </Link>
      </section>

      <FeaturedProducts />
    </main>
  )
}
